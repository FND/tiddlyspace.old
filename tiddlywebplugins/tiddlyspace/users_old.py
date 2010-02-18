"""
Add or remove a user from a space
"""
from tiddlyweb.model.bag import Bag
from tiddlyweb.model.recipe import Recipe
from tiddlyweb.model.user import User
from tiddlyweb.model.policy import Policy

from space import Space


def add_user_to_policy(user_to_add, policy):
    """
    create the new policy section to add to the original policy
    """
    new_policy = {}
    for attr, value in policy.iteritems():
        if attr != 'owner':
            new_policy[attr] = [user.replace('USER_NAME', user_to_add.usersign) for user in value]
    
    return new_policy
    
def remove_from_policy(user_to_remove, policy):
    """
    remove the user from the policy. Manage should already have been checked
    
    ignore the owner section, so that if the owner is removed
    they can add themselves back in.
    
    NB - that will require extra code somewhere
    """
    new_policy = Policy()
    for attr, values in policy.__dict__.iteritems():
        if attr != 'owner' and user_to_remove.usersign in getattr(policy, attr):
            setattr(new_policy, attr, getattr(policy, attr))
            getattr(new_policy, attr).remove(user_to_remove.usersign)
        else:
            setattr(new_policy, attr, getattr(policy, attr))
    new_policy.owner = policy.owner
    
    return new_policy

def add_user(environ, space_name, user_name):
    """
    add user_name to space_name while
    checking the policy allows the logged
    in user to do it
    """
    store = environ['tiddlyweb.store']
    
    user = User(user_name)
    user = store.get(user)
    
    logged_in_user = environ['tiddlyweb.usersign']
    
    space_definition = environ['tiddlyweb.config']['space']
    space = []
    for name, values in space_definition['bags'].iteritems():
        new_policy = add_user_to_policy(user, values['policy'])
        space.append((Bag(name.replace('SPACE_NAME', space_name)), new_policy))
    for name, values in space_definition['recipes'].iteritems():
        new_policy = add_user_to_policy(user, values['policy'])
        space.append((Recipe(name.replace('SPACE_NAME', space_name)), new_policy))
    
    space = [(store.get(thing), policy) for thing, policy in space]
    
    for thing, new_policy in space:
        thing.policy.allows(logged_in_user, 'manage')
        for policy_name, policy_values in thing.policy.__dict__.iteritems():
            if policy_name != 'owner':
                thing.policy.__dict__[policy_name].extend(new_policy[policy_name])
                thing.policy.__dict__[policy_name] = list(set(thing.policy.__dict__[policy_name]))
        store.put(thing)
        
def remove_user(environ, space_name, user_name):
    """
    remove user_name from space_name while
    checking the policy allows the logged
    in user to do it
    """
    store = environ['tiddlyweb.store']
    
    user = User(user_name)
    user = store.get(user)
    
    logged_in_user = environ['tiddlyweb.usersign']
    
    space_definition = environ['tiddlyweb.config']['space']
    space = []
    for name, values in space_definition['bags'].iteritems():
        bag = Bag(name.replace('SPACE_NAME', space_name))
        bag = store.get(bag)
        bag.policy.allows(logged_in_user, 'manage')
        bag.policy = remove_from_policy(user, bag.policy)
        space.append(bag)
    for name, values in space_definition['recipes'].iteritems():
        recipe = Recipe(name.replace('SPACE_NAME', space_name))
        recipe = store.get(recipe)
        recipe.policy.allows(logged_in_user, 'manage')
        recipe.policy = remove_from_policy(user, recipe.policy)
        space.append(recipe)
        
    for thing in space:
        store.put(thing)