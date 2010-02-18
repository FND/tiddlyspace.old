"""
define custom config that gets merged with tiddlyweb.config

specifcally, define what a space is
"""

from tiddlywebwiki.config import config
from tiddlywebplugins.instancer.util import get_tiddler_locations

from tiddlywebplugins.tiddlyspace.instance import store_contents


PACKAGE_NAME = 'tiddlywebplugins.tiddlyspace'


config['instance_tiddlers'] = get_tiddler_locations(store_contents, PACKAGE_NAME)

config['space'] = { # XXX: WTF?
    'bags': {
        'SPACE_NAME_public': {
            "desc": "SPACE_NAME public bag",
            "policy": {
                "read": [],
                "create": ["USER_NAME"],
                "manage": ["USER_NAME"],
                "accept": [],
                "owner": "USER_NAME",
                "write": ["USER_NAME"],
                "delete": ["USER_NAME"]
            }
        },
        'SPACE_NAME_private': {
            "desc": "SPACE_NAME private bag",
            "policy": {
                "read": ["USER_NAME"],
                "create": ["USER_NAME"],
                "manage": ["USER_NAME"],
                "accept": [],
                "owner": "USER_NAME",
                "write": ["USER_NAME"],
                "delete": ["USER_NAME"]
            }
        }
    },
    'recipes': {
        "SPACE_NAME_public": {
            "recipe": [
                ["system", ""],
                ["_public", ""],
                ["SPACE_NAME_public", ""]
            ],
            "desc": "SPACE_NAME public recipe",
            "policy": {
                "read": [],
                "create": ["USER_NAME"],
                "manage": ["USER_NAME"],
                "accept": [],
                "owner": "USER_NAME",
                "write": ["USER_NAME"],
                "delete": ["USER_NAME"]
            }
        },
        "SPACE_NAME_private": {
            "recipe": [
                ["system", ""],
                ["_private", ""],
                ["SPACE_NAME_public", ""],
                ["SPACE_NAME_private", ""]
            ],
            "desc": "SPACE_NAME private recipe",
            "policy": {
                "read": ["USER_NAME"],
                "create": ["USER_NAME"],
                "manage": ["USER_NAME"],
                "accept": [],
                "owner": "USER_NAME",
                "write": ["USER_NAME"],
                "delete": ["USER_NAME"]
            }
        }
    }
}
