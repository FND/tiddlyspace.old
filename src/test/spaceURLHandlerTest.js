
  module("spaceURLHandler", {
    setup: function() {
      canonicalURLHandler = new CanonicalURLHandler("http://example.com/");
      subdomainURLHandler = new SubdomainURLHandler("tiddlyspace.com");
    }
  });

  test("infer name - canonical", function() {
    equals("book", canonicalURLHandler.inferSpaceName("http://example.com/recipes/book_public/tiddlers.wiki"));
  });

  test("compose URL - canonical", function() {
    equals(canonicalURLHandler.composePublicRecipeURL("book"), "http://example.com/recipes/book_public");
    equals(canonicalURLHandler.composePrivateBagURL("book"), "http://example.com/bags/book_private");
  });

  test("compose Space Home - canonical", function() {
    equals(canonicalURLHandler.composeSpaceURL("book"), "http://example.com/recipes/book_public/tiddlers.wiki");
  });

  test("infer name - subdomain", function() {
    equals("book", subdomainURLHandler.inferSpaceName("book.tiddlyspace.com"));
  });

  test("compose URL - subdomain", function() {
    equals(subdomainURLHandler.composePublicRecipeURL("book"), "http://book.tiddlyspace.com/recipes/book_public");
  });

  test("compose Space Home - subdomain", function() {
    equals(subdomainURLHandler.composeSpaceURL("book"), "http://book.tiddlyspace.com");
  });


