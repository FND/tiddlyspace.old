from tiddlywebwiki.instance import (instance_config, store_contents, store_structure)

_osmosoft = 'psd ben martin jermolene fnd simon cdent rakugo mahemoff'.split()
for username in osmosoft:
    store_structure['users'][username] = {
        'note': 'Osmosoftonian',
        'roles': ['ADMIN']
    }

members = ['psd']
public_policy = {
  "read": [],
  "write": members,
  "create": members,
  "delete": members,
  "manage": members,
  "accept": members,
  "owner": members
}

private_policy = {}.update(public_policy)
private_policy["read"] = members

store_structure['bags']['book_public'] = {
  'desc': 'TiddlyPocketBook',
  'policy': public_policy
}

store_structure['recipes']['book_public_recipe'] = {
  'desc': 'TiddlyPocketBook',
  'policy': public_policy,
  'bags': [
    ('book_public', '')
  ]
}

store_structure['bags']['book_private'] = {
  'desc': 'TiddlyPocketBook',
  'policy': private_policy
}

store_structure['recipes']['book_private_recipe'] = {
  'desc': 'TiddlyPocketBook',
  'policy': private_policy,
  'bags': [
    ('system', ''),
    ('book_public', ''),
    ('book_private', '')
  ]
}
