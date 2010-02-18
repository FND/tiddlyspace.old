/***
|Name|Manage Users|
|Version|0.1|
|Author|Ben Gillies|
|Type|plugin|
|Description|Add and remove users from tiddlyspace|
!Usage
&lt;&lt;manageUsers action:add space:spacename>>
&lt;&lt;manageUsers action:remove space:spacename>
&lt;&lt;manageUsers action:list space:spacename>
!Code
***/
//{{{
    if(!version.extensions.ManageUsers)
    { //# ensure that the plugin is only installed once
        version.extensions.ManageUsers = { installed: true }
    };
    
    config.macros.manageUsers = {
        containerNames: {
            pub: '_public',
            priv: '_private'
        },
        handler: function(place, macroName, params, wikifier, paramString, tiddler) {
            params = paramString.parseParams();
            var space = params[0]['space'][0];
            var action = params[0]['action'][0];
            
            //generate names
            this.containerNames.pub = space + this.containerNames.pub;
            this.containerNames.priv = space + this.containerNames.priv;
            
            if (action === 'add') {
                
            } else if (action === 'remove') {
                
            } else if (action === 'list') {
                
            }
        },
        listUsers: function(space) {
            //assume that bag/recipe policies are correct and consistent within a space
            var url = config.defaultCustomFields['server.host'] + 'bags/' + this.containerNames['pub']
            jQuery.ajax({
                url: url,
                dataType: 'application/json',
                type: 'GET',
                success: function(container, textStatus, XMLHttpRequest) {
                    
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    
                }
            });
        },
        addUsersToSpace: function(space, users) {
            this.changeSpaceMembers(space, users, this.processAddUsers);
        },
        removeUsersFromSpace: function(space, users) {
            this.changeSpaceMembers(space, users, this.processRemoveUsers);
        },
        changeSpaceMembers: function(space, users, processObject) {
            var url = config.defaultCustomFields['server.host'];
            publicBagUrl = url + 'bags/' + this.containerNames['pub'] + '.json';
            this.objectGet(publicBagUrl, processObject, function() {
                privateBagUrl = url + 'bags/' + this.containerNames['priv'] + '.json';
                this.objectGet(privateBagUrl, processObject, function() {
                    publicRecipeUrl = url + 'recipes/' + this.containerNames['pub'] + '.json';
                    this.objectGet(publicRecipeUrl, processObject, function() {
                        publicRecipeUrl = url + 'recipes/' + this.containerNames['priv'] + '.json';
                        this.objectGet(publicRecipeUrl, processObject, function() {
                            this.successFunc(space, users);
                        }, function() {
                            this.failFunc(space, users);
                        });
                    }, function() {
                        this.failFunc(space, users);
                    });
                }, function() {
                    this.failFunc(space, users);
                });
            }, function() {
                this.failFunc(space, users);
            });
        },
        failFunc: function(space, users) {
            displayMessage('There was an error adding the user(s)');
        },
        successFunc: function(space, users) {
            displayMessage('User(s) added');
        },
        objectGetPut: function(url, processObject, successCallback, errorCallback) {
            //GET an object (bag or recipe), call processObject on it, then PUT it back
            jQuery.ajax({
                url: url,
                type: 'GET',
                dataType: 'json',
                success: function(container, textStatus, XMLHttpRequest) {
                    processObject(container, users);
                    jQuery.ajax({
                        url: url,
                        data: container,
                        contentType: 'application/json',
                        type: 'PUT',
                        success:function(data, textStatus, XMLHttpRequest) {
                            successCallback();
                        },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                            errorCallback();
                        }
                    });
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    errorCallback();
                }
            });
        },
        processAddUsers: function(container, users) {
            //When given an object (bag or recipe), add users to the policy
            var policy = container.policy;
            for(user in users) {
                for(attr in policy) {
                    if (attr !== 'owner') {
                        policy[attr].pushUnique(user);
                    }
                }
            }
        },
        processRemoveUsers: function(container, users) {
            //When given an object (bag or recipe), add users to the policy
            var policy = container.policy;
            for(user in users) {
                for(attr in policy) {
                    if ((attr !== 'owner') && (!policy[attr].contains(user))) {
                        policy[attr].splice(policy[attr].indexOf(user), 1);
                    }
                }
            }
        }
    }
//}}}