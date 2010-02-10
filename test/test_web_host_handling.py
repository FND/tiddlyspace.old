
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


def test_get_other_host_unauth():
    http = httplib2.Http()

    response, content = http.request('http://our_test_domain:8001/',
            headers={'Host': 'testuser.our_test_domain:8001'},
            method='GET')

    assert response['status'] == '404'
    assert 'get recipe testuser_public' in content


def test_get_other_host_auth():
    http = httplib2.Http()
    secret = make_user('testuser', 'testpass')
    cookie = 'tiddlyweb_user=testuser:%s' % secret

    response, content = http.request('http://our_test_domain:8001/',
            headers={'Cookie': cookie, 'Host': 'testuser.our_test_domain:8001'},
            method='GET')
    assert response['status'] == '404'
    assert 'get recipe testuser_private' in content


def make_user(username, password):
    user = User(username)
    user.set_password(password)
    store.put(user)

    secret_string = sha('%s%s' % (username, config['secret'])).hexdigest()
    return secret_string
