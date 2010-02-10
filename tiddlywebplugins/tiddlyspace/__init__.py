"""
TiddlySpace
TiddlyWeb-based multi-user TiddlyWiki hosting

website: http://tiddlyspace.com
repository: http://github.com/FND/tiddlyspace
"""

from tiddlyweb.util import merge_config
from tiddlywebplugins.utils import replace_handler

from config import config as space_config
from handler import home, post_space_handler, post_adduser_to_space_handler, post_removeuser_from_space_handler


def init(config):
    """
    merge custom config with config
    """
    merge_config(config, space_config) # XXX: we probably don't wanna do this here

    if 'selector' in config:
        replace_handler(config['selector'], '/', dict(GET=home))
        config['selector'].add('/spaces[/]', POST=post_space_handler)
        config['selector'].add('/adduser/{space_name:segment}[/]', POST=post_adduser_to_space_handler)
        config['selector'].add('/removeuser/{space_name:segment}[/]', POST=post_removeuser_from_space_handler)
