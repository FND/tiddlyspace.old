function Space(name, members, subscriptions) {

  var name = name;
  var members = members.sort();
  var subscriptions = subscriptions;
  var space = this;

  this.isMember = function(member) {
    return _(members).include(member);
  }

  this.getName = function(member) {
    return name;
  }

  function getPublicPolicy() {
    return {
      read: [], create: members, manage: members, accept: members,
      write: members, owner: members, "delete": members
    };
  }

  function getPrivatePolicy() {
    return _(getPublicPolicy()).extend({read: members});
  }

  this.getPublicBag = function() {
    return {
      policy: getPublicPolicy(),
      desc: ""
    };
  }

  this.getPrivateBag = function() {
    return {
      policy: getPrivatePolicy(),
      desc: ""
    };
  }

  this.getPublicRecipe = function() {
    var bags = ["system", "_public"].concat(
      _(subscriptions).map(function(subscription) { return subscription+"_public" })
    ).concat(name+"_public");
    return {
      policy: getPublicPolicy(),
      recipe: _(bags).map(function(bag) { return [bag,""] }), // bags don't have filters
      desc: ""
    };
  }

  this.getPrivateRecipe = function() {
    var recipe = this.getPublicRecipe().recipe.concat([["_private",""],[name+"_private",""]]);
    return {
      policy: getPrivatePolicy(),
      recipe: recipe,
      desc: ""
    };
   var publicRecipe = this.getPublicPolicy(member);
  }



}
