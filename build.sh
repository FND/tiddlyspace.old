#!/bin/bash

##############################################################################
# ensure dependencies are present
##############################################################################

python -c 'import tiddlywebwiki'
if [ $? != '0' ] ; then
  echo 'need tiddlywebwiki'
  sudo pip install -U tiddlywebwiki
fi

python -c 'import tiddlywebplugins.virtualhosting'
if [ $? != '0' ] ; then
  echo 'need virtualhosting'
  sudo pip install tiddlywebplugins.virtualhosting
fi

##############################################################################
# cache (some) online dependencies
##############################################################################

./cacher

##############################################################################
# make an instance dir, getting the previous one out of the way
##############################################################################

instance="instance"
if [ -d $instance ] ; then
  mv $instance /tmp/tiddlyspace-server-$$
fi
./tiddlyspace $instance

##############################################################################
# Include dependencies. In production, we would apparently just rely
# on pip packages being present, but for now, we need to mangle
# tiddlywebconfig manually. (this is fragile!)
##############################################################################

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

twanager twimport book_public http://hoster.peermore.com/recipes/TiddlyPocketBook/tiddlers.wiki

twanager twimport book_demo_public http://hoster.peermore.com/recipes/TiddlyPocketBook/tiddlers.wiki
twanager twimport book_demo_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

twanager twimport osmobook_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

##############################################################################
# tell the developer what just happened
##############################################################################

echo "*********************************************"
echo "  Instance Complete"
echo "*********************************************"
echo "now you can run 'cd instance ; twanager server' and point your browser at http://0.0.0.0:8080/."
echo "To log in, visit http://0.0.0.0:8080 and type in 'username' (e.g. psd, cdent, ...) and password is 'x'"
