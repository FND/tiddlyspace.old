function Space(name, members, subscriptions) {

  var name = name;
  var subscriptions = subscriptions.sort();
  var members = members.sort();
  var space = this;

  this.isMember = function(member) {
    return _(members).include(member);
  }

  this.getMembers = function(member) {
    return _(members).clone();
  }

  this.addMember = function(member) {
    members = members.concat(member);
    members.sort();
  }

  this.removeMember = function(member) {
    members = _(members).without(member);
    members.sort();
  }

  this.addSubscription = function(subscription) {
    subscriptions = subscriptions.concat(subscription);
    subscriptions.sort();
  }

  this.removeSubscription = function(subscription) {
    subscriptions = _(subscriptions).without(subscription);
    subscriptions.sort();
  }

  this.getName = function(member) {
    return name;
  }

  this.getSubscriptions = function(member) {
    return subscriptions;
    return _(subscriptions).clone();
  }

  function getPolicyMembers() {
    return members.length ? members : ["NONE"];
  }

  function getPublicPolicy() {
    return {
      "read": [],
      "create": getPolicyMembers(members),
      "manage": getPolicyMembers(members),
      "accept": getPolicyMembers(members),
      "write":  getPolicyMembers(members),
      "owner":  getPolicyMembers(members),
      "delete": getPolicyMembers(members)
    };
  }

  function getPrivatePolicy() {
    return _(getPublicPolicy()).extend({"read": getPolicyMembers(members)});
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
