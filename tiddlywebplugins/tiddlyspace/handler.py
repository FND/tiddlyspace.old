"""
entry point for selector urls
"""

import urllib

import urllib
from cgi import FieldStorage

from tiddlyweb.model.recipe import Recipe
from tiddlyweb.web.http import HTTP302, HTTP404, HTTP409
from tiddlyweb.web.util import recipe_url
from tiddlywebplugins.utils import require_any_user

from space import Space, BagExistsError, RecipeExistsError


def home(environ, start_response):
    host = environ['tiddlyweb.config']['server_host']['host']
    subdomain = environ['HTTP_HOST'].split('.%s' % host) # XXX: hacky?
    username = subdomain[0]

    if username:
        type = 'public' # TODO: if member, use private
        recipe = Recipe('%s_%s' % (username, type))
        route = '%s/tiddlers.wiki' % recipe_url(environ, recipe)
        _redirect(route)


@require_any_user()
def post_space_handler(environ, start_response):
    """
    entry point for posting a new space name to TiddlyWeb
    """
    space_name = environ['tiddlyweb.query']['name'][0]

    space = Space(environ)

    try:
        space.create_space(space_name, environ['tiddlyweb.config']['space'])
    except RecipeExistsError, BagExistsError:
        raise HTTP409('Space already Exists: %s' % space_name)

    host = environ['tiddlyweb.config']['server_host']
    if 'port' in host:
        port = ':%s' % host['port']
    else:
        port = ''

    recipe = Recipe('%s_public' % space_name)
    new_space_uri = '%s/tiddlers.wiki' % recipe_url(environ, recipe)

    start_response('303 See Other', [
        ('Location', new_space_uri),
        ('Content-type', 'text/plain')])

    return [new_space_uri]


def _redirect(uri):
    raise HTTP302(uri)
