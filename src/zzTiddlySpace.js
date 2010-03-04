store.addNotification("TiddlySpaceStyleSheet", refreshStyles);
store.addNotification("jquery.autocomplete", refreshStyles);


var oldRegisterCallback = config.adaptors.tiddlyweb.registerCallback;
config.adaptors.tiddlyweb.registerCallback = function(username) {
	oldRegisterCallback();
	console.log('done register stuff');
	spaceStore.put(new Space(username, [], [username]));
}
