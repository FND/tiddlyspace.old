instance_tiddlers = {
    '_public': ['../src/backstageClone.recipe']
}


def update_config(config):
    for bag, uris in instance_tiddlers.items():
        config['local_instance_tiddlers'][bag] = uris
