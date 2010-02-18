#!/usr/bin/env bash

instance_dir="/data/vhost/tiddlyspace.labs.osmosoft.com/tiddlyweb"
timestamp=`date +"%Y-%m-%d_%H%M%S"`

echo "updating repository and rebuilding package" && \
git pull && \
python setup.py sdist && \
pip install -U --no-deps dist/*tiddlyspace*tar.gz && \
echo "creating instance" && \
./dev.sh && \
echo "backing up existing instance" && \
mv $instance_dir "backup/instance_$timestamp" && \
echo "moving over instance" && \
mv instance $instance_dir && \
cp -f backup/tiddlywebconfig.py $instance_dir/ && \
curl -o $instance_dir/apache.py http://github.com/tiddlyweb/tiddlyweb/raw/master/apache.py && \
chown -R fnd:www-data /data/vhost/tiddlyspace.labs.osmosoft.com && \
apache2ctl restart
