"""
Define a class suitable for creating a space
"""
from tiddlyweb.model.bag import Bag
from tiddlyweb.model.recipe import Recipe
from tiddlyweb.store import NoBagError, NoRecipeError


class BagExistsError(Exception):
    """
    raised when a bag already exists and create_bag is called
    """
    pass

class RecipeExistsError(Exception):
    """
    raised when a recipe already exists and create_recipe is called
    """
    pass

class Space():
    """
    create a space, consisting of a combination 
    of bags/recipes.
    """
    def __init__(self, environ):
        """
        set the store
        """
        self.store = environ['tiddlyweb.store']
        self.user = environ['tiddlyweb.usersign']
        self.name = ''

    def create_space(self, space):
        """
        create the bags and recipes supplied by space
        
        space should be a dict of bags/recipes.
        """
        self.name = space
        
        for bag_name, bag in space['bags'].iteritems():
            try:
                self.create_bag(bag_name, bag.get('policy'), bag.get('desc'))
            except BagExistsError:
                pass
        
        for recipe_name, recipe in space['recipes'].iteritems():
            try:
                self.create_recipe(recipe_name, recipe['recipe'], \
                    recipe.get('policy'), recipe.get('desc'))
            except RecipeExistsError:
                pass

    def exists(self, thing):
        """
        test if the object passed in exists
        
        return the object if it does, None if it doesn't
        """
        try:
            obj = self.store.get(thing)
        except NoBagError:
            return None
        except NoRecipeError:
            return None
        
        return obj

    def set_policy(self, policy, thing):
        """
        set the policy on the object

        policy is a dict of the policy, eg:
        """
        if policy:
            for attr, value in policy.iteritems():
                if type(value) == list:
                    policy[attr] = [user.replace('USER_NAME', self.user.name) for user in value]
                else:
                    policy[attr] = value.replace('USER_NAME', self.user.name)
                    
            thing.policy.__dict__ = policy

    def set_desc(self, desc, thing):
        """
        set the description on the object

        desc is a string
        """
        if desc:
            desc = desc.replace('SPACE_NAME', self.name)
            desc = desc.replace('USER_NAME', self.user.name)
            thing.desc = desc

    def create_bag(self, name, policy=None, desc=None):
        """
        create a bag
        """
        name = name.replace('SPACE_NAME', self.name)
        bag = Bag(name)
        
        if self.exists(bag):
            raise BagExistsError('%s already exists' % self.name)
            
        self._put_thing(bag, policy, desc)

    def create_recipe(self, name, recipe_contents, policy=None, desc=None):
        """
        create a recipe
        """
        name = name.replace('SPACE_NAME', self.name)
        
        recipe = Recipe(name)
        
        if self.exists(recipe):
            raise RecipeExistsError('%s already exists' % name)
        
        recipe.set_recipe(recipe_contents)
        
        self._put_thing(recipe, policy, desc)

    def _put_thing(self, thing, policy, desc):
        """
        put the thing into the store without checking
        """
        self.set_policy(policy, thing)
        self.set_desc(desc, thing)
        
        self.store.put(thing)
