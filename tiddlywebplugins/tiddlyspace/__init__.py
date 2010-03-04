"""
TiddlySpace
TiddlyWeb-based multi-user TiddlyWiki hosting

website: http://tiddlyspace.com
repository: http://github.com/FND/tiddlyspace
"""

from tiddlyweb.util import merge_config
from tiddlywebplugins.utils import replace_handler

from tiddlywebplugins.tiddlyspace.config import config as space_config
from tiddlywebplugins.tiddlyspace.handler import home, post_space_handler
from tiddlywebplugins.tiddlyspace.users import (list_users, get_user,
        put_user, post_user)


def init(config):
    """
    merge custom config with config
    """
    import tiddlywebwiki
    tiddlywebwiki.init(config)
    import tiddlywebplugins.virtualhosting
    # calling init on virtualhosting not required

    merge_config(config, space_config) # XXX: we probably don't wanna do this here

    if 'selector' in config:
        replace_handler(config['selector'], '/', dict(GET=home))
        config['selector'].add('/spaces[/]', POST=post_space_handler)
        config['selector'].add('/users', GET=list_users, POST=post_user)
        config['selector'].add('/users/{usersign}', GET=get_user, PUT=put_user)
