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

(function($) {

    if(!version.extensions.ManageUsers)
    { //# ensure that the plugin is only installed once
        version.extensions.ManageUsers = { installed: true }
    };

    // the makings of a space class - TODO prototype etc
    function Space(publicFlag, name) {

      if (arguments.length) {
        this.publicFlag = publicFlag;
        this.name = name;
      } else {
        var matches = location.href.match(/\/recipes\/(.*)_(private|public)\//); // NEEDS SUBDOMAIN WORK
        this.name = matches[1];
        this.publicFlag = matches[2];
      }

    }

    Space.prototype.getURL = function(publicFlag, bagFlag, format) {
      if (arguments.length<2) format = "json";
      return config.defaultCustomFields['server.host']
           + (bagFlag ? "bag" : "recipe") + "s"
           + this.name + "_" + this.getPublicity()+(format ? "."+format : "");
      return location.href.match(/\/recipes\/(.*)_(private|public)\//); // NEEDS SUBDOMAIN WORK
    }

    // Space.prototype.getPublicBag = function(publicFlag, bagFlag) { return getEntity(true, true); }
    // Space.prototype.putPublicBag = function(publicFlag, bagFlag) { putEntity(true, true); }

    /*
    Space.prototype.getEntity = function(publicFlag, bagFlag) {
      return 
    }

    Space.prototype.putEntity = function() {
      return 
    }
    */

    Space.prototype.getPublicity = function() {
      return this.publicFlag ? "public" : "private";
    }

    Space.prototype.findUsers = function(callback) {
      var url = config.defaultCustomFields['server.host'] + 'bags/' + this.name + "_" + this.getPublicity()+".json";
      jQuery.ajax({
          url: url,
          dataType: 'application/json',
          type: 'GET',
          success: function(bagInfo) {
            return callback(JSON.decode(bagInfo).policy.manage);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("list error", arguments)
          }
      });
    }

    Space.prototype.modifyUsers = function(users) {
      var url = this.getURL(true, true);
      jQuery.ajax({
          url: url,
          type: 'GET',
          dataType: 'json',
          success: function(container, textStatus, XMLHttpRequest) {
              // TODO modify!
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
   
        bag = this.getPublicBag();
        var newUsers = bag.policy.manage.concat(users);
        bag.policy = [];
        for(action in policy) {
          if (action !== 'owner') bag.policy = newUsers;
        }
        putPublicBag();
      }

    Space.prototype.setUsers = function(users, processObject) {
      var url = config.defaultCustomFields['server.host'];
      publicBagUrl = url + 'bags/' + this.containerNames['pub'] + '.json';
      this.modify(publicBagUrl, processObject, function() {
          privateBagUrl = url + 'bags/' + this.containerNames['priv'] + '.json';
          this.modify(privateBagUrl, processObject, function() {
              publicRecipeUrl = url + 'recipes/' + this.containerNames['pub'] + '.json';
              this.modify(publicRecipeUrl, processObject, function() {
                  publicRecipeUrl = url + 'recipes/' + this.containerNames['priv'] + '.json';
                  this.modify(publicRecipeUrl, processObject, function() {
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
  };

  function failFunc(space, users) {
      displayMessage('There was an error adding the user(s)');
  }

  function successFunc(space, users) {
      displayMessage('User(s) added');
  }
    
    config.macros.manageUsers = {
        containerNames: {
            pub: '_public',
            priv: '_private'
        },
        handler: function(place, macroName, params, wikifier, paramString, tiddler) {
            params = paramString.parseParams();
            // var space = params[0].action ? params[0].space : (new Space()).name;
            var space = new Space();
            var action = params[0].action ? params[0].action[0] : "list";
            console.log("space", space);
            
            //generate names
            this.containerNames.pub = space + this.containerNames.pub;
            this.containerNames.priv = space + this.containerNames.priv;
            
            if (action === 'add') {
                
            } else if (action === 'remove') {
                
            } else if (action === 'list') {
              var users = this.listUsers($(place), space);
              console.log(users);
            }
        },
        listUsers: function($place, space) {
          //assume that bag/recipe policies are correct and consistent within a space
          space.findUsers(function(users) {
            $.each(users, function(i, user) {
              var $users = $("<ul/>").appendTo($place);
              var $user = $("<li>"+user+"</li>").appendTo($users);
              $("<span class='remove'>X</span>").appendTo($user).click(function() {
                console.log("remove " + $user.html());
              });
            });
          });
        },
        /*
        addUsersToSpace: function(space, users) {
          this.changeSpaceMembers(space, users, this.processAddUsers);
        },
        removeUsersFromSpace: function(space, users) {
          this.changeSpaceMembers(space, users, this.processRemoveUsers);
        },
        */
    }

  function modify(url, processObject, successCallback, errorCallback) {
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
  };

  function processAddUsers(container, users) {
    //When given an object (bag or recipe), add users to the policy
    var policy = container.policy;
    for(user in users) {
        for(attr in policy) {
            if (attr !== 'owner') {
                policy[attr].pushUnique(user);
            }
        }
    }
  }

  function processRemoveUsers(container, users) {
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



})(jQuery);
//}}}
