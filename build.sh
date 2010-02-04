#!/bin/bash
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

echo "*********************************************"
echo "  Instance Complete"
echo "*********************************************"
echo "now you can run 'cd instance ; twanager server' and point your browser at http://0.0.0.0:8080."
echo "To log in, visit http://0.0.0.0:8080 and type in 'username' (e.g. psd, cdent, ...) and password is 'x'"
