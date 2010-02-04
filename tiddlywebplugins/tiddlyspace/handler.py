"""
entry point for selector urls
"""
from space import Space, BagExistsError, RecipeExistsError

from cgi import FieldStorage
from tiddlywebplugins.utils import require_any_user
from tiddlyweb.web.http import HTTP409

@require_any_user()
def post_space_handler(environ, start_response):
    """
    entry point for posting a new space name to TiddlyWeb
    """
    space_form = FieldStorage(fp=environ['wsgi.input'], environ=environ)
    
    space_name = space_form['name'][0]
    
    space = Space(environ)
    
    try:
        space.create_space(space_name)
    except RecipeExistsError, BagExistsError:
        raise HTTP409('Space already Exists: %s' % space_name)
        
    host = environ['tiddlyweb.config']['server_host']
    new_space_uri = '%s://%s/%s/recipes/%s_public/tiddlers.wiki' % \
        (host['scheme'],
        host['host'],
        environ['tiddlyweb.config']['server_prefix'],
        space_name)
        
    start_response('303 See Other', [
        ('Location', new_space_uri),
        ('Content-type', 'text/plain')])
        
    return [new_space_uri]