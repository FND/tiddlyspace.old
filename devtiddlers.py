instance_tiddlers = {
    '_public': ['../src/split.recipe'],
    'system': ['../src/TiddlyWebAdaptor.js']
}


def update_config(config):
    for bag, uris in instance_tiddlers.items():
        config['local_instance_tiddlers'][bag] = uris
