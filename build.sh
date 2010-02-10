#!/bin/bash -ex
instance="instance"
if [ -d $instance ] ; then
  mv $instance /tmp/tiddlyspace-server-$$
fi

./cacher
./tiddlyspace $instance

cd $instance
osmosoft='psd ben martin jermolene fnd simon cdent rakugo mahemoff'
for user in $osmosoft ; do
  twanager userpass $user x
done

twanager twimport book_public http://hoster.peermore.com/recipes/TiddlyPocketBook/tiddlers.wiki

twanager twimport book_demo_public http://hoster.peermore.com/recipes/TiddlyPocketBook/tiddlers.wiki
twanager twimport book_demo_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

twanager twimport osmobook_public http://hoster.peermore.com/bags/TiddlyPocketBook%20-%20TiddlyWiki%20Cheatsheet/tiddlers.wiki

echo "*********************************************"
echo "  Instance Complete"
echo "*********************************************"
echo "now you can run 'cd instance ; twanager server' and point your browser at http://0.0.0.0:8080/."
echo "To log in, visit http://0.0.0.0:8080 and type in 'username' (e.g. psd, cdent, ...) and password is 'x'"
