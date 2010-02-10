#!/usr/bin/env bash

instance_dir="/data/tiddlyweb/tiddlyspace"
timestamp=`date +"%Y-%m-%d_%H%M%S"`

echo "updating repository and rebuilding package" && \
git pull && \
python setup.py sdist && \
pip install -U --no-deps dist/*tiddlyspace*tar.gz && \
echo "creating instance" && \
./build.sh && \
echo "backing up existing instance" && \
mv $instance_dir "backup/instance_$timestamp" && \
echo "moving over instance" && \
mv instance $instance_dir && \
cp -f backup/instance_2010-02-10/tiddlywebconfig.py $instance_dir/ && \
curl -o $instance_dir/apache.py http://github.com/tiddlyweb/tiddlyweb/raw/master/apache.py && \
/etc/init.d/httpd restart 
