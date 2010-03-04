"""
A challenger based on the cookie form challenger,
except that rather than presenting an HTML form,
it presents a TiddlyWiki which is/will be cooked
to show login and registration stuff.
"""

from tiddlyweb.web.handler.recipe import get_tiddlers

from tiddlyweb.web.challengers.cookie_form import Challenger as CookieForm


class Challenger(CookieForm):

    CHALLENGER_RECIPE = '_challenger'

    def challenge_get(self, environ, start_response):
        """
        Construct a wiki which will include the necessary
        bits to do a login. Those necessary bits will include
        the required client side code to post back to the
        cookie_form.
        """
        environ['wsgiorg.routing_args'][1]['recipe_name'] = self.CHALLENGER_RECIPE
        environ['tiddlyweb.type'] = 'text/x-tiddlywiki'
        return get_tiddlers(environ, start_response)
