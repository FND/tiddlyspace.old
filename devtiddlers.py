instance_tiddlers = {
    '_public': ['../src/split.recipe'],
    '_private': ['../src/private/split.recipe'],
    'dashboard':['../src/dashboard/split.recipe']
}


def update_config(config):
    for bag, uris in instance_tiddlers.items():
        config['local_instance_tiddlers'][bag] = uris
