/***
|Name|Manage members|
|Version|0.1|
|Author|Ben Gillies, Michael Mahemoff|
|Type|plugin|
|Description|Add and remove members from tiddlyspace|
!Usage
&lt;&lt;manageMembers&gt;&gt;
!Code
***/
//{{{

(function($) {

  config.macros.manageMembers = {
    handler: function(place, macroName, params, wikifier, paramString, tiddler) {
      populateUsers(function() { renderSubscriptions(place); });
    }
  };

  function renderSubscriptions(place) {
    $members = $("<div class='manage manageMembers' />");

    var $newMember = $("<input />")
      .appendTo($members)
      .keyup(function(ev) {
        var key = ev.charCode || ev.keyCode || 0;
        if (key==13) $(this).siblings("button").click(); // RETURN => click add
      });

    $("<button>Add Member</button>").appendTo($members).click(function() {
      spaceStore.getFromCurrentURL(function(space) {
        space.addMember($newMember.val());
        spaceStore.put(space, function() { renderSubscriptions(place); });
      });
    });

    $("<h4>Members</h4>").appendTo($members);
    var $list = $("<ul/>").appendTo($members);
    spaceStore.getFromCurrentURL(function(space) {
      $.each(space.getMembers(), function(i, member) {
        var $member = $("<li/>").appendTo($list);
        $("<span class='remove'>X</span>").appendTo($member).click(function() {
          var unwanted = $(this).next().html();
          space.removeMember(unwanted);
          spaceStore.put(space, function() { renderSubscriptions(place); });
        });
        $("<span class='name'>"+member+"</span>").appendTo($member);
      });
      var members = space.getMembers();
      var candidates = _(allUsers).select(function(user) {
        return (members.indexOf(user) == -1);
      });
      $newMember.autocomplete({list: candidates});
    });
    $(place).html($members);
  }

  var allUsers;
  function populateUsers(callback) {
    jQuery.ajax({
      url: "/users",
      type: 'GET',
      success: function(usersText) {
        allUsers = _($.trim(usersText).split("\n")).map(function(line) {
          return line.split(" ")[0];
        });
        callback();
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        displayMessage("error loading users list");
      }
    });
  }

})(jQuery);
//}}}
