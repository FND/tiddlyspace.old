/***
|''Name:''|testCloneSpace|
|''Description:''|macro that clones a TiddlySpace|
|''Version:''|0.0.1|
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
	var params = {host:config.macros.clone.host,original:config.macros.clone.original,manage:config.macros.clone.manage,owner:config.macros.clone.owner};
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
console.log('original recipe',context.recipe);

	var recipes = context.recipes;
	for(var i=0;i<recipes.length;i++) {
		bag = recipes[i];
		console.log('bag',bag);
		if(bag[0]==userParams.original) {
			bag[0] = userParams.clone;
			break;
		}
	}
	context.format = '.json?fat=1';
	context.workspace = 'bags/' + userParams.original;
	var ret = context.adaptor.getTiddlerList(context,userParams,config.macros.clone.testcallback2);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.clone.testcallback2 = function(context,userParams)
{
	displayMessage("Testing callback2");
console.log('callback2 tiddlers',context.tiddlers);
	store.suspendNotifications();
	for(var i=0;i<context.tiddlers.length;i++) {
		var tiddler = context.tiddlers[i];
		//if(!tiddler.created)
		//	tiddler.created = tiddler.modified;
		store.saveTiddler(tiddler.title, tiddler.title, tiddler.text, tiddler.modifier, tiddler.modified, tiddler.tags, tiddler.fields, true, tiddler.created);
	}
	store.resumeNotifications();
	store.notifyAll();
	refreshDisplay();
	autoSaveChanges();

	// copy the recipe to the new workspace
	context.workspace = 'bags/' + userParams.clone;
	context.recipe.policy = {manage:userParams.manage,owner:userParams.owner};
//	context.adaptor.putRecipe(tiddler,context);

	// now put the tiddlers to the new workspace
	for(i=0;i<context.tiddlers.length;i++) {
		tiddler = context.tiddlers[i];
		tiddler.fields['server.workspace'] = context.workspace;
//		context.adaptor.putTiddler(tiddler,context);
	}
};

/*}}}*/
