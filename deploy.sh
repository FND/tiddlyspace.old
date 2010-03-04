#!/usr/bin/env bash

host="tiddlyspace.labs.osmosoft.com"
instance_dir="/data/vhost/tiddlyspace.labs.osmosoft.com/tiddlyweb"

git pull && \
make dist && \
scp dist/*tiddlyspace*tar.gz "$host:~/tmp/" && \
ssh $host "cd ~/tmp && sudo pip install -U *tiddlyspace*tar.gz && " \
	"cd $instance_dir && sudo twanager update && sudo apache2ctl restart"
