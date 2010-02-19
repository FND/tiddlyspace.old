var spaceStore;

(function() {

  spaceStore = {
    get: function(name, handler) {
      var url = composePublicBagURL(name);
      jQuery.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        success: function(bag) {
          console.log("bag", bag);
          handler(new Space(
            name,
            bag.policy.write, // members
            [] // TODO
          ));
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
          displayMessage("error loading space " + name);
        }
      });
    },
    getFromCurrentURL: function(handler) {
      var matches = location.href.match(/\/recipes\/(.*)_(private|public)\//); // NEEDS SUBDOMAIN WORK
      return matches ? spaceStore.get(matches[1], handler) : displayMessage("no space found");
    },
    put: function(space, success) {
      var putCalls = [
        { url: composePublicBagURL(space),     entity: space.getPublicBag()     },
        { url: composePublicRecipeURL(space),  entity: space.getPublicRecipe()  },
        { url: composePrivateBagURL(space),    entity: space.getPrivateBag()    },
        { url: composePrivateRecipeURL(space), entity: space.getPrivateRecipe() }
      ];
      (function makeNextPutCall() {
        var putCall = putCalls.shift();
        if (!putCall) {  // we're done; all calls have been made
          success();
          return;
        }
        jQuery.ajax({
          url: putCall.url,
          data: JSON.encode(putCall.entity),
          contentType: 'application/json',
          type: 'PUT',
          success:function() {
            makeNextPutCall();
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
            displayMessage("got error PUTting to " + url);
          }
        });
      })();
    }
  };

  function composePublicBagURL(space) {
    return composeURL(name(space), true, true);
  }

  function composePublicRecipeURL(space) {
    return composeURL(name(space), false, true);
  }

  function composePrivateBagURL(space) {
    return composeURL(name(space), true, false);
  }

  function composePrivateRecipeURL(space) {
    return composeURL(name(space), false, false);
  }

  function name(space) {
    return (typeof(space)=="string") ? space : space.getName();
  }

  function composeURL(space, isBag, isPublic) {
    return config.defaultCustomFields['server.host']
           + (isBag ? "bags/" : "recipes/")
           + space
           + (isPublic ? "_public" : "_private");
  }

})();
