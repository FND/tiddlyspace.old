config.macros.createSpace = {
	'wizardTitle':'Create a Space',
	'ste`p1Title':'enter new space name',
	'step1Html':'<input name="cloneName">',
	'cloneButtonText':'Clone this Space', 
	'cloneButtonCaption':'click to clone this space',
	'createButtonText':'Create New Space',
	'createButtonCaption':'click to create a new space',
	'newSpaceLink':'<br/><a href="%0" target="new_window">%0</a>'		
};
config.macros.createSpace.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	me = config.macros.createSpace;
	var w = new Wizard();
	w.createWizard(place,me.wizardTitle);
	w.addStep(me.step1Title,me.step1Html);
	w.setButtons(
	[{caption: me.createButtonText, tooltip: me.createButtonCaption, onClick: function() {me.doCreate(w);} },
	{caption: me.cloneButtonText, tooltip: me.cloneButtonCaption, onClick: function() {me.doClone(w);} }
])
}

config.macros.createSpace.doCreate = function(w) {
	var spaceName = w.getValue('cloneName').value;
	jQuery.ajax({type:'POST', url:'/spaces', data:{'name':spaceName}, success:function(data, textStatus, XMLHttpRequest) {
		w.addStep('created', 'created '+spaceName+config.macros.createSpace.newSpaceLink.format([data]));
	}, error:function(response){
		w.addStep('Error', 'There was an error creating the space '+spaceName);
	}, complete: console.log });

};

config.macros.createSpace.doClone = function(w) {
	config.macros.createSpace.doCreate(w);
	console.log(w.getValue('cloneName').value);
	// call bens code 
	// call martins code 

	var params = {	host:window.location.host,
			original:'osmobook_public',
			manage:[config.options.txtUserName],
			owner:config.options.txtUserName,
			clone:w.getValue('cloneName').value};

	config.macros.createSpace.test(params);
};

config.macros.createSpace.test = function(params)
{
	clearMessage();
	displayMessage("Testing");
	var adaptor = new config.adaptors['tiddlyweb']();
	var context = {status:true,host:params.host,recipe:params.original};
	var ret = adaptor.getRecipes(context,params,config.macros.createSpace.testcallback);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.createSpace.testcallback = function(context,userParams)
{
	displayMessage("Testing callback");

	// update the recipes
	var recipes = context.recipes.recipe;
	for(var i=0;i<recipes.length;i++) {
		bag = recipes[i];
		if(bag[0]==userParams.original) {
			bag[0] = userParams.clone;
			break;
		}
	}
	context.recipes.policy.owner = userParams.owner;
	context.recipes.policy.manage = userParams.manage;

	context.format = '.json?fat=1';
	context.workspace = 'bags/' + userParams.original;
	var ret = context.adaptor.getTiddlerList(context,userParams,config.macros.createSpace.testcallback2);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.createSpace.testcallback2 = function(context,userParams)
{
	displayMessage("Testing callback2");

	store.suspendNotifications();
	for(var i=0;i<context.tiddlers.length;i++) {
		var tiddler = context.tiddlers[i];
		if(!tiddler.creator)
			tiddler.creator = tiddler.modifier;
		store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields, true, tiddler.created);
	}
	store.resumeNotifications();
	store.notifyAll();
	refreshDisplay();
	autoSaveChanges();

	context.workspace = 'bags/' + userParams.clone;
	context.callback = null;
	// copy the recipe to the new workspace
	//context.adaptor.putRecipe(context);

	// now put the tiddlers to the new workspace
	for(i=0;i<context.tiddlers.length;i++) {
		tiddler = context.tiddlers[i];
		tiddler.fields['server.workspace'] = context.workspace;
		delete tiddler.fields['server.page.revision'];
		context.adaptor.putTiddler(tiddler,context);
	}
};
