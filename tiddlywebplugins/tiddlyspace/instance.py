from tiddlywebwiki.instance import (instance_config, store_contents, store_structure)

def create_space(name, members, public_recipe_bags=[]):

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

  public_recipe_lines = map(lambda bag: (bag, ''), public_recipe_bags)

  store_structure['bags'][name+'_public'] = {
    'desc': 'TiddlyPocketBook',
    'policy': public_policy
  }

  store_structure['recipes'][name+'_public'] = {
    'desc': 'TiddlyPocketBook',
    'policy': public_policy,
    'recipe': public_recipe_lines
  }

  store_structure['bags'][name+'_private'] = {
    'desc': 'TiddlyPocketBook',
    'policy': private_policy
  }

  private_recipe_lines = []
  private_recipe_lines.extend(public_recipe_lines)
  private_recipe_lines.extend(['system',name+"_private"])
  store_structure['recipes']['book_private_recipe'] = {
    'desc': 'TiddlyPocketBook',
    'policy': private_policy,
    'recipe': [
      ('system', ''),
      (name+'_public', ''),
      (name+'_private', '')
    ]
  }

#######
## main

_osmosoft = 'psd ben martin jermolene fnd simon cdent rakugo mahemoff'.split()
for username in _osmosoft:
    store_structure['users'][username] = {
        'note': 'Osmosoftonian',
        'roles': ['ADMIN']
    }

create_space('book',      ['psd'],   ['book_public'])
create_space('book_demo', ['psd'],   ['book_public', 'book_demo_public'])
create_space('osmobook',  _osmosoft, ['book_public', 'osmobook_public'])
