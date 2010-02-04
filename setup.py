# YOU NEED TO EDIT THESE
AUTHOR = 'Osmosoft'
AUTHOR_EMAIL = 'hello@osmosoft.com'
NAME = 'tiddlywebplugins.tiddlyspace'
DESCRIPTION = 'TiddlySpace is for Tiddly Spaces'
VERSION = '0.1'


import os

from setuptools import setup, find_packages


# You should carefully review the below (install_requires especially).
setup(
    namespace_packages = ['tiddlywebplugins'],
    name = NAME,
    version = VERSION,
    description = DESCRIPTION,
    long_description = open(os.path.join(os.path.dirname(__file__), 'README')).read(),
    author = AUTHOR,
    url = 'http://pypi.python.org/pypi/%s' % NAME,
    packages = find_packages(exclude='test'),
    author_email = AUTHOR_EMAIL,
    platforms = 'Posix; MacOS X; Windows',
    install_requires = ['setuptools',
        'tiddlyweb',
        'tiddlywebwiki',
        'tiddlywebplugins.utils',
        ],
    zip_safe = False,
    include_package_data = True,
    )
