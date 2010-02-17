/***
|''Name:''|testCloneSpace|
|''Description:''|macro that clones a TiddlySpace|
|''Version:''|0.0.2|
|''Date:''|Feb 4, 2010|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |

***/

/*{{{*/


config.macros.clone = {
	label: "clone",
	prompt: "clone",
	title: "clone",
	host: "http://hoster.peermore.com/",
	original: "TiddlyPocketBook - TiddlyWiki Cheatsheet",
	clone: "TiddlyPocketBookCamera",
	manage: ["managerName"],
	owner: "ownerName"
};

config.macros.clone.handler = function(place,macroName,params,wikifier,paramString,tiddler)
{
	createTiddlyButton(place,this.label,this.prompt,this.onClick);
};

config.macros.clone.onClick = function(e)
{
	var clone = config.macros.clone;
	var params = {host:clone.host,original:clone.original,manage:clone.manage,owner:clone.owner,clone:clone.clone};
	config.macros.clone.test(params);
	return false;
};


config.macros.clone.test = function(params)
{
	clearMessage();
	displayMessage("Testing");
	var adaptor = new config.adaptors['tiddlyweb']();
	var context = {status:true,host:params.host,recipe:params.original};
	var ret = adaptor.getRecipes(context,params,config.macros.clone.testcallback);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.clone.testcallback = function(context,userParams)
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
	var ret = context.adaptor.getTiddlerList(context,userParams,config.macros.clone.testcallback2);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.clone.testcallback2 = function(context,userParams)
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

/*}}}*/
