"""
A plugin that allows for the administration of
users over HTTP. This is done as a plugin for two
reasons:

    * To make use of it easily optional for any installation.
    * To allow exploration of the API before possibly solidifying
      it in the core.

Basically it allows an admin user to view all the users and
make changes.

Add 'users' to system_plugins. To view any of these urls
a user with the ADMIN will need to exist in the store.
"""

import simplejson

from tiddlywebplugins.utils import require_any_user, require_role
from tiddlyweb.web.http import HTTP404, HTTP415, HTTP400, HTTP409
from tiddlyweb.model.user import User
from tiddlyweb.store import NoUserError

@require_any_user()
def list_users(environ, start_response):
    store = environ['tiddlyweb.store']
    users = store.list_users()
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return ['%s\n' % user for user in users]


@require_any_user()
def get_user(environ, start_response):
    store = environ['tiddlyweb.store']
    try:
        usersign = environ['wsgiorg.routing_args'][1]['usersign']
        user = User(usersign)
        user = store.get(user)
    except (NoUserError, KeyError), exc:
        raise HTTP404('Unable to load user: %s, %s' % (usersign, exc))
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return ['%s' % user]

def put_user(environ, start_response):
    pass

@require_role('ADMIN')
def post_user(environ, start_response):
    """
    Create a new user through a JSON POST to /users.
    If the not JSON, return 415. If users exists, return 409.
    """
    store = environ['tiddlyweb.store']
    content_type = environ['tiddlyweb.type']
    length = environ['CONTENT_LENGTH']
    if content_type != 'application/json':
        raise HTTP415('application/json required')
    content = environ['wsgi.input'].read(int(length))

    try:
        user_info = simplejson.loads(content)
    except ValueError, exc:
        raise HTTP400('Invalid JSON, %s' % exc)

    try:
        user = User(user_info['username'])
        try:
            store.get(user)
            raise HTTP409('User exists')
        except NoUserError:
            pass # we're carrying on below

        user.set_password(user_info['password'])
    except KeyError, exc:
        raise HTTP400('Missing required data: %s', exc)

    store.put(user)
    start_response('201 Create', [
        ('Content-Type', 'text/html; charset=UTF-8')
        ])
    return "Created %s" % user_info['username']
