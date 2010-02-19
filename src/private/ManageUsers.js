/***
|Name|Manage Users|
|Version|0.1|
|Author|Ben Gillies, Michael Mahemoff|
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

  config.macros.manageUsers = {
    handler: function(place, macroName, params, wikifier, paramString, tiddler) {
      renderSpace(place);
    }
  };

  function renderSpace(place) {
    $members = $("<div class='manageMembers' />");

    var $newMember = $("<input />").appendTo($members).keyup(function(ev) {
      var key = ev.charCode || ev.keyCode || 0;
      console.log(key);
      if (key==13) $(this).siblings("button").click(); // RETURN => click add
    });

    $("<button>Add Member</button>").appendTo($members).click(function() {
      spaceStore.getFromCurrentURL(function(space) {
        space.addMember($newMember.val());
        spaceStore.put(space, function() { renderSpace(place); });
      });
    });

    $("<h4>Members</h4>").appendTo($members);
    var $list = $("<ul/>").appendTo($members);
    spaceStore.getFromCurrentURL(function(space) {
      $.each(space.getMembers(), function(i, member) {
        var $member = $("<li/>").appendTo($list);
        $("<span class='removeMember'>X</span>").appendTo($member).click(function() {
          var unwanted = $(this).next().html();
          space.removeMember(unwanted);
          spaceStore.put(space, function() { renderSpace(place); });
        });
        $("<span class='name'>"+member+"</span>").appendTo($member);
      });
    });
    $(place).html($members);
  }

})(jQuery);
//}}}
