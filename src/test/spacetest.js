
  var space;

  module("space", {
    setup: function() {
      space = new Space("book", ["psd", "fnd"], ["blog"]);
    }
  });

  test("name", function() {
    equals(space.getName(), "book");
  });

  test("members", function() {

    equals(space.getMembers().length, 2);
    ok(space.isMember("psd"));
    ok(! space.isMember("ben"));

    space.addMember("ben");
    ok(space.isMember("ben"));
    equals(space.getMembers().length, 3);

    space.removeMember("ben");
    ok(! space.isMember("ben"));

  });

  test("subscriptions", function() {
    equals(space.getSubscriptions(), ["blog"]);

    space.addSubscription("news");
    equals(space.getSubscriptions(), ["blog", "news"]);

    space.removeSubscription("news");
    equals(space.getSubscriptions(), ["blog"]);
  });

  test("public bag", function() {
    console.log(space.getPublicBag().policy);
    var expected = {
      policy: {
        read: [],             create: ["fnd","psd"], manage: ["fnd","psd"], accept: ["fnd","psd"],
        write: ["fnd","psd"], owner: ["fnd","psd"], "delete": ["fnd","psd"]
      },
      desc: ""
    };
    equals(expected, space.getPublicBag());
  });

  test("private bag", function() {
    var expected = {
      policy: {
        read:  ["fnd", "psd"], create: ["fnd","psd"], manage: ["fnd","psd"],  accept: ["fnd","psd"],
        write: ["fnd","psd"],  owner: ["fnd","psd"],  "delete": ["fnd","psd"]
      },
      desc: ""
    };
    equals(expected, space.getPrivateBag());
  });

  test("public recipe", function() {
    var expected = {
      policy: {
        read:  [],            create: ["fnd","psd"], manage:  ["fnd","psd"], accept: ["fnd","psd"],
        write: ["fnd","psd"], owner: ["fnd","psd"], "delete": ["fnd","psd"]
      },
      recipe: [["system",""], ["_public",""], ["blog_public",""], ["book_public", ""]],
      desc: ""
    };
    equals(expected, space.getPublicRecipe());
  });

  test("private recipe", function() {
    console.log(space.getPrivateRecipe());
    var expected = {
      policy: {
        read:  ["fnd","psd"], create: ["fnd","psd"], manage:   ["fnd","psd"], accept: ["fnd","psd"],
        write: ["fnd","psd"], owner:  ["fnd","psd"], "delete": ["fnd","psd"]
      },
      recipe: [ ["system",""], ["_public",""], ["blog_public",""],
                ["book_public",""], ["_private",""], ["book_private",""]],
      desc: ""
    };
    equals(expected, space.getPrivateRecipe());
  });

  test("empty space", function() {
    space.removeMember("fnd");
    space.removeMember("psd");
    var expected = {
      policy: {
        read: [], create: ["NONE"], manage: ["NONE"], accept: ["NONE"],
        write: ["NONE"], owner: ["NONE"], "delete": ["NONE"]
      },
      desc: ""
    };
    equals(expected, space.getPublicBag());
  });

  equals = function(actual, expected) {
    ok(_(actual).isEqual(expected),
       "expected **" + expected + "**, got **" + actual + "**")
  }
