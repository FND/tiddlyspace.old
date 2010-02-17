#!/bin/bash -ex

# git pull

##############################################################################
# ensure dependencies are present
##############################################################################

# sudo pip install -U tiddlywebwiki tiddlywebplugins.devstore tiddlywebplugins.virtualhosting tiddlywebplugins.utils

##############################################################################
# cache (some) online dependencies
##############################################################################

# ./cacher
make remotes

##############################################################################
# make an instance dir, getting the previous one out of the way
##############################################################################

instance="instance"
if [ -d $instance ] ; then
  mv -f $instance /tmp/tiddlyspace-server-$$
fi
# ./tiddlyspace $instance
twinstance_dev tiddlywebplugins.tiddlyspace $instance

cat >> $instance/tiddlywebconfig.py <<EOF
from devtiddlers import update_config
update_config(config)
EOF

##############################################################################
# Include dependencies. In production, we would apparently just rely
# on pip packages being present, but for now, we need to mangle
# tiddlywebconfig manually. (this is fragile!)
##############################################################################

exit
cd $instance
ln -s ../tiddlywebplugins .
ln -s ../mangler.py .
sed -i '' "s/# A basic configuration\./import mangler/g" tiddlywebconfig.py

##############################################################################
# populate user passwords, as tiddlyweb instancer mechanism doesn't allow for it
# (http://groups.google.com/group/tiddlyweb/browse_thread/thread/274ed6d9417740b4/83483050f8020080)
##############################################################################

osmosoft='psd ben martin jermolene fnd simon cdent rakugo mahemoff'
for user in $osmosoft ; do
  twanager userpass $user x
done

##############################################################################
# populate with sample data
##############################################################################

twanager twimport book_plugins_public http://hoster.peermore.com/recipes/TiddlyPocketBook/tiddlers.wiki

twanager twimport book_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

# not exactly DRY - lots of simulating cloning here
twanager twimport osmobook_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

##############################################################################
# tell the developer what just happened
##############################################################################

cat <<END
*********************************************
Instance Complete
*********************************************

Now you can run:
  cd instance ; twanager server

And point your browser at:
  http://0.0.0.0:8080/

To log in, visit 
  http://0.0.0.0:8080/challenge/cookie_form
  ... and type in 'username' (e.g. psd, cdent, ...) and password is just one letter: 'x'

You can see a user's public space by visiting, for example:
  http://0.0.0.0:8080/recipes/psd_public/tiddlers.wiki

You can see your own private space by visiting:
  http://0.0.0.0:8080/recipes/USERNAME_private/tiddlers.wiki
  (where USERNAME is the user you logged in as)

To grasp the model of spawning applications, see how we have: PSD's "book_plugins" space with the application logic for tiddlypocketbook; PSD's "book" space with demo content and 'following' the public "book_plugins" bag; *and* the collectively-owned "osmobook" space which is a clone of "book" space, with its own content and also 'following' the public "book_plugins" bag.
  http://0.0.0.0:8080/recipes/book_plugins_public/tiddlers.wiki
  http://0.0.0.0:8080/recipes/book_public/tiddlers.wiki
  http://0.0.0.0:8080/recipes/osmobook_public/tiddlers.wiki

You can go backstage to create a new space and (soon) clone an existing one
END
