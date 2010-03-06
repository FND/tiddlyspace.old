#!/usr/bin/env sh

# Usage:
#   $ ./deploy.sh [quick] [logname]

if [ "$1" = "quick" ]; then
	pip_options="--no-dependencies"
	shift
fi

host="${1}tiddlyspace.labs.osmosoft.com"
instance_dir="/data/vhost/tiddlyspace.labs.osmosoft.com/tiddlyweb"

git pull && \
make dist && \
scp dist/*tiddlyspace*tar.gz "$host:~/tmp/tiddlyspace.tar.gz" && \
ssh $host "cd ~/tmp &&
	echo 'installing' &&
	sudo pip install $pip_options -U tiddlyspace.tar.gz &&
	echo 'updating' &&
	cd $instance_dir && sudo twanager update &&
	sudo chown -R fnd:www-data $instance_dir &&
	echo 'restarting' &&
	sudo apache2ctl restart"
