from tiddlywebwiki.instance import (instance_config, store_contents, store_structure)


instance_config['system_plugins'] = ['tiddlywebplugins.tiddlyspace']
instance_config['twanager_plugins'] = ['tiddlywebplugins.tiddlyspace']


#### TODO ensure ?bag_create_policy and ?recipe_create_policy are false (for production)
#### (in tiddlywebconfig)

#=======================================================================
# create space
#=======================================================================

def create_space(name, members, public_recipe_bags=[]):

  ###################################################################
  # Set up stock policies
  ###################################################################

  public_policy = {
    "read": [],
    "write": members,
    "create": members,
    "delete": members,
    "manage": members,
    "accept": members,
    "owner": members
  }

  private_policy = {}
  private_policy.update(public_policy)
  private_policy["read"] = members

  ###################################################################
  # Set up recipes
  ###################################################################

  public_recipe_bags.append("_public")
  public_recipe_lines = map(lambda bag: (bag, ''), public_recipe_bags)

  ###################################################################
  # Set up public space
  ###################################################################

  store_structure['bags'][name+'_public'] = {
    'desc': 'todo',
    'policy': public_policy
  }

  store_structure['recipes'][name+'_public'] = {
    'desc': 'todo',
    'policy': public_policy,
    'recipe': public_recipe_lines
  }

  ###################################################################
  # Set up private space
  ###################################################################

  store_structure['bags'][name+'_private'] = {
    'desc': 'todo',
    'policy': private_policy
  }

  private_recipe_lines = []
  private_recipe_lines.extend(public_recipe_lines)
  private_recipe_lines.extend(['system','_private',name+"_private"])
  store_structure['recipes'][name+'_private'] = {
    'desc': 'todo',
    'policy': private_policy,
    'recipe': [
      ('system', ''),
      (name+'_public', ''),
      (name+'_private', '')
    ]
  }

#=======================================================================
# main
#=======================================================================

###################################################################
## define policy const
###################################################################

open_policy = { "read": [], "write": [], "create": [], "delete": [], "manage": [], "accept": [], "owner": [] }

###################################################################
## set up global public bag
###################################################################

store_structure['bags']['_public'] = {
  'desc': 'Public tiddlyspace bag - contains tiddlywiki (client-side) plugins for tiddlyspace public recipes, e.g. browsing and searching the whole server; and cloning',
  'policy': open_policy
}

store_contents['_public'] = ['http://github.com/FND/tiddlyspace/raw/master/src/backstageClone.recipe']

###################################################################
## set up global private bag
###################################################################

store_structure['bags']['_private'] = {
  'desc': 'Private tiddlyspace bag - same as _public bag, but for inclusion in *private* recipes, e.g. managing membership',
  'policy': open_policy
}

###################################################################
## set up sample users and their spaces
###################################################################

_osmosoft = 'psd ben martin jermolene fnd simon cdent rakugo mahemoff'.split()
for username in _osmosoft:
  store_structure['users'][username] = {
      'note': 'Osmosoftonian',
      'roles': ['ADMIN']
  }
  create_space(username, [username], [username+'_public'])

###################################################################
## set up sample content spaces
###################################################################

create_space('book',      ['psd'],   ['book_public'])
create_space('book_demo', ['psd'],   ['book_public', 'book_demo_public'])
create_space('osmobook',  _osmosoft, ['book_public', 'osmobook_public'])

# store_contents['book_public'].append('http://hoster.peermore.com/recipes/TiddlyPocketBook.tiddlywiki')
