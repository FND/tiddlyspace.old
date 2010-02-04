
from tiddlyweb.config import config
from tiddlyweb.model.user import User
from tiddlyweb.util import sha
from tiddlyweb.store import Store

from wsgi_intercept import httplib2_intercept
import wsgi_intercept
import httplib2

import shutil


def setup_module(module):
    try:
        shutil.rmtree('store')
    except:
        pass # !!!
    config['server_host'] = {
            'host': 'our_test_domain',
            'port': '8001',
            'scheme': 'http',
            }
    from tiddlyweb.web import serve
    # we have to have a function that returns the callable,
    # Selector just _is_ the callable
    def app_fn():
        return serve.load_app()
    #wsgi_intercept.debuglevel = 1
    httplib2_intercept.install()
    wsgi_intercept.add_wsgi_intercept('our_test_domain', 8001, app_fn)

    environ = {'tiddlyweb.config': config}
    module.store = Store(config['server_store'][0], config['server_store'][1], environ)


def test_post():
    secret = make_user('testuser', 'testpass')
    cookie = 'tiddlyweb_user=testuser:%s' % secret
    http = httplib2.Http()

    try:
        response, content = http.request('http://our_test_domain:8001/spaces?name=wow',
                headers={'Cookie': cookie}, method='POST', redirections=0)
    except httplib2.RedirectLimit, e:
        pass

    assert e.response['status'] == '303'
    assert e.response['location'] == 'http://our_test_domain:8001/recipes/wow_public/tiddlers.wiki'


def make_user(username, password):
    user = User(username)
    user.set_password(password)
    store.put(user)

    secret_string = sha('%s%s' % (username, config['secret'])).hexdigest()
    return secret_string
