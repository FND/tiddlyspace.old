from tiddlyweb.config import config
from tiddlyweb.model.user import User
from tiddlyweb.store import Store

from base64 import b64encode

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

    admin = User('admin')
    admin.add_role('ADMIN')
    admin.set_password('spank')
    module.store.put(admin)
    module.admin_authorization = b64encode('admin:spank')
    module.user_authorization = b64encode('cdent:pigdog')


def test_post_new_user():
    http = httplib2.Http()

    response, content = http.request('http://our_test_domain:8001/users',
            method='POST',
            headers={'Content-Type': 'application/json'},
            body='{"username":"cdent","password":"pigdog"}')

    assert response['status'] == '403'
    assert 'insufficient' in content

    response, content = http.request('http://our_test_domain:8001/users',
            method='POST',
            headers={'Content-Type': 'application/json',
                'Authorization': 'Basic %s' % admin_authorization},
            body='{"username":"cdent","password":"pigdog"}')

    assert response['status'] == '201'
    
    user = User('cdent')
    user = store.get(user)
    assert user.check_password('pigdog') is True
    assert user.check_password('slam') is False

    response, content = http.request('http://our_test_domain:8001/users',
            method='POST',
            headers={'Content-Type': 'application/json',
                'Authorization': 'Basic %s' % admin_authorization},
            body='{"username":"cdent","password":"pigdog"}')
    assert response['status'] == '409'
    assert 'User exists' in content


def test_put_password():
    http = httplib2.Http()

    response, content = http.request('http://our_test_domain:8001/users/cdent',
            method='PUT',
            headers={'Content-Type': 'application/json'},
            body='{"password":"pigcat"}')

    assert response['status'] == '403'

    response, content = http.request('http://our_test_domain:8001/users/cdent',
            method='PUT',
            headers={'Content-Type': 'application/json',
                'Authorization': 'Basic %s' % user_authorization},
            body='{"password":"pigcat"}')

    assert response['status'] == '204'
    
    user = User('cdent')
    user = store.get(user)
    assert user.check_password('pigcat') is True
    assert user.check_password('pigdog') is False

    response, content = http.request('http://our_test_domain:8001/users/cdent',
            method='PUT',
            headers={'Content-Type': 'application/json',
                'Authorization': 'Basic %s' % admin_authorization},
            body='{"password":"pigcow"}')
    assert response['status'] == '204'
    
    user = User('cdent')
    user = store.get(user)
    assert user.check_password('pigcow') is True
    assert user.check_password('pigcat') is False
