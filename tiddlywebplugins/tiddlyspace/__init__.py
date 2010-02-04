"""
TiddlySpace
TiddlyWeb-based multi-user TiddlyWiki hosting

website: http://tiddlyspace.com
repository: http://github.com/FND/tiddlyspace
"""
from config import config as space_config
from handler import post_space_handler

from tiddlyweb.util import merge_config


def init(config):
    """
    merge custom config with config
    """
    merge_config(config, space_config)