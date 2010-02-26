
/***
|Name|Manage subscriptions|
|Version|0.1|
|Author|Michael Mahemoff|
|Type|plugin|
|Description|Add and remove subscriptions from tiddlyspace|
!Usage
&lt;&lt;manageSubscriptions&gt;&gt;
!Code
***/
//{{{

(function($) {

  var allSpaces;
  config.macros.manageSubscriptions = {
    handler: function(place, macroName, params, wikifier, paramString, tiddler) {
      spaceStore.getAllSpaces(function(_allSpaces) {
        allSpaces = _allSpaces;
        renderSubscriptions(place);
      });
    }
  };

  function renderSubscriptions(place) {
    $subscriptions = $("<div class='manage manageSubscriptions' />");

    var $newSubscription = $("<input />").appendTo($subscriptions).keyup(function(ev) {
      var key = ev.charCode || ev.keyCode || 0;
      if (key==13) $(this).siblings("button").click(); // RETURN => click add
    });

    $("<button>Subscribe to Space</button>").appendTo($subscriptions).click(function() {
      spaceStore.getFromCurrentURL(function(space) {
        space.addSubscription($newSubscription.val());
        spaceStore.put(space, function() { renderSubscriptions(place); });
      });
    });

    $("<h4>Subscriptions</h4>").appendTo($subscriptions);
    var $list = $("<ul/>").appendTo($subscriptions);
    spaceStore.getFromCurrentURL(function(space) {
      $.each(space.getSubscriptions(), function(i, subscription) {
        var $subscription = $("<li/>").appendTo($list);
        $("<span class='remove'>X</span>").appendTo($subscription).click(function() {
          var unwanted = $(this).next().html();
          space.removeSubscription(unwanted);
          spaceStore.put(space, function() { renderSubscriptions(place); });
        });
        $("<span class='name'>"+subscription+"</span>").appendTo($subscription);
      });
      var candidateSpaces = _(allSpaces).select(function(aSpace) {
        return (space.getSubscriptions().indexOf(aSpace) == -1);
      });
      $newSubscription.autocomplete({list: candidateSpaces});
    });
    $(place).html($subscriptions);
  }

})(jQuery);
//}}}
