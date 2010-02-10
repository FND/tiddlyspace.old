"""
entry point for selector urls
"""

import urllib

import urllib
from cgi import FieldStorage

from tiddlyweb.model.recipe import Recipe
from tiddlyweb.web.http import HTTP302, HTTP404, HTTP409, HTTP400, HTTP403
from tiddlyweb.web.util import recipe_url, server_host_url
from tiddlyweb.web.handler import root
from tiddlyweb.web.handler.recipe import get_tiddlers
from tiddlywebplugins.utils import require_any_user
from tiddlyweb.model.policy import ForbiddenError, UserRequiredError
from tiddlyweb.store import NoUserError, NoBagError, NoRecipeError

from space import Space, BagExistsError, RecipeExistsError
from users import add_user, remove_user


def home(environ, start_response):
    # take the scheme off the host_url to compare with
    # HTTP_HOST
    host_url = server_host_url(environ).split('://', 1)[1]
    http_host = environ.get('HTTP_HOST', host_url)
    if http_host == host_url:
        return root(environ, start_response)

    username = _determine_username_from_host(environ, http_host)

    type = 'public'
    if username == environ['tiddlyweb.usersign']['name']:
        type = 'private'

    recipe_name = '%s_%s' % (username, type)
    environ['wsgiorg.routing_args'][1]['recipe_name'] = recipe_name
    environ['tiddlyweb.type'] = 'text/x-tiddlywiki'

    return get_tiddlers(environ, start_response)


def _determine_username_from_host(environ, http_host):
    """
    Calculate the username that is associated with a domain.
    At the moment this is just a split, but db lookups could
    happen here.
    """
    return http_host.split('.')[0]

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

@require_any_user()
def post_adduser_to_space_handler(environ, start_response):
    """
    add the given user to the space named in the url
    """
    space_name = environ['wsgiorg.routing_args'][1]['space_name']
    if 'user' not in environ['tiddlyweb.query']:
        raise HTTP400('No user supplied')
    user_to_add = environ['tiddlyweb.query']['user'][0]
    
    try:
        add_user(environ, space_name, user_to_add)
    except NoUserError:
        raise HTTP400('User does not exist: %s' % user_to_add)
    except NoBagError, NoRecipeError:
        raise HTTP404('Space not found: %s' % space_name)
    except ForbiddenError, UserRequiredError:
        raise HTTP403('You do not have permission to add %s to %s' % (user_to_add, space_name))
        
    start_response('204 No Content', [
        ('Content-type', 'text/plain')
    ])
    
    return []

@require_any_user()
def post_removeuser_from_space_handler(environ, start_response):
    """
    remove the given user from the space named in the url
    """
    space_name = environ['wsgiorg.routing_args'][1]['space_name']
    if 'user' not in environ['tiddlyweb.query']:
        raise HTTP400('No user supplied')
    user_to_remove = environ['tiddlyweb.query']['user'][0]
    
    try:
        remove_user(environ, space_name, user_to_remove)
    except NoUserError:
        raise HTTP400('User does not exist: %s' % user_to_add)
    except NoBagError, NoRecipeError:
        raise HTTP404('Space not found: %s' % space_name)
    except ForbiddenError, UserRequiredError:
        raise HTTP403('You do not have permission to remove %s from %s' % (user_to_remove, space_name))
        
    start_response    ('204 No Content', [
            ('Content-type', 'text/plain')
        ])
    
    return []
