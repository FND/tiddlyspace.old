#!/usr/bin/env sh

host="tiddlyspace.labs.osmosoft.com"
instance_dir="/data/vhost/tiddlyspace.labs.osmosoft.com/tiddlyweb"

if [ "$1" = "quick" ]; then
	pip_options="--no-dependencies"
fi

git pull && \
make dist && \
scp dist/*tiddlyspace*tar.gz "$host:~/tmp/" && \
ssh $host "cd ~/tmp && " \
	"sudo pip install $pip_options -U *tiddlyspace*tar.gz && " \
	"cd $instance_dir && sudo twanager update && sudo apache2ctl restart"
