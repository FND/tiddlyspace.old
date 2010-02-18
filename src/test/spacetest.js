
  var space;

  module("space", {
    setup: function() {
      space = new Space("book", ["psd", "fnd"], ["blog"]);
    }
  });

  test("data model", function() {
    equals(space.getName(), "book");
    ok(space.isMember("psd"));
    ok(! space.isMember("badguy"));
  });

  test("public bag", function() {
    var expected = {
      policy: {
        read: [],             create: ["fnd","psd"], manage: ["fnd","psd"], accept: ["fnd","psd"],
        write: ["fnd","psd"], owner: ["fnd","psd"], "delete": ["fnd","psd"]
      },
      desc: ""
    };
    ok(_.isEqual(expected, space.getPublicBag()));
  });

  test("private bag", function() {
    var expected = {
      policy: {
        read:  ["fnd", "psd"], create: ["fnd","psd"], manage: ["fnd","psd"],  accept: ["fnd","psd"],
        write: ["fnd","psd"],  owner: ["fnd","psd"],  "delete": ["fnd","psd"]
      },
      desc: ""
    };
    ok(_.isEqual(expected, space.getPrivateBag()));
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
    ok(_.isEqual(expected, space.getPublicRecipe()));
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
    ok(_.isEqual(expected, space.getPrivateRecipe()));
  });
