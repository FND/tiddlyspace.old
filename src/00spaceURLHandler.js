// TODO: should do proper inheritance

function URLHandler() {}
URLHandler.prototype.composePublicBagURL = function(spaceName) { return this.composeURL(spaceName, true, true); };
URLHandler.prototype.composePublicRecipeURL = function(spaceName) { return this.composeURL(spaceName, false, true); };
URLHandler.prototype.composePrivateBagURL = function(spaceName) { return this.composeURL(spaceName, true, false); };
URLHandler.prototype.composePrivateRecipeURL = function(spaceName) { return this.composeURL(spaceName, false, false); };

function CanonicalURLHandler(serverHost) {
  this.serverHost = serverHost;
}

CanonicalURLHandler.prototype = new URLHandler();

CanonicalURLHandler.prototype.inferSpaceName = function(spaceURL) {
  var matches = spaceURL.match(/\/recipes\/(.*)_(private|public)\//);
  return matches ? matches[1] : null;
};

CanonicalURLHandler.prototype.composeURL = function(spaceName, isBag, isPublic) {
  return this.serverHost
         + (isBag ? "bags/" : "recipes/")
         + spaceName
         + (isPublic ? "_public" : "_private");
}

CanonicalURLHandler.prototype.composeSpaceURL = function(spaceName) {
  return this.composePublicRecipeURL(spaceName) + "/tiddlers.wiki";
};

function SubdomainURLHandler(rootDomain) {
  this.rootDomain = rootDomain;
}
SubdomainURLHandler.prototype = new URLHandler();

SubdomainURLHandler.prototype.inferSpaceName = function(spaceURL) {
  return spaceURL.replace("."+this.rootDomain, ""); // should really use RE
};

// note: this will fall down if there's a server prefix path, though that would
// be unlikely in practice.
SubdomainURLHandler.prototype.composeURL = function(spaceName, isBag, isPublic) {
  return this.composeSpaceURL(spaceName)
         + "/" // should include prefix here
         + (isBag ? "bags/" : "recipes/")
         + spaceName
         + (isPublic ? "_public" : "_private");
};

SubdomainURLHandler.prototype.composeSpaceURL = function(spaceName) {
  return "http://" + spaceName + "." + this.rootDomain;
};

// THIS IS CONFIG SO SHOULD REALLY BE IN zzConfig, but it needs to be done before other plugins are login
// For standard twanager/cherrypi dev
function getURLHandler() { return new CanonicalURLHandler(config.defaultCustomFields['server.host']); }
// For subdomain support
// var urlHandler = new SubdomainHandler("tiddlyspace.com");
