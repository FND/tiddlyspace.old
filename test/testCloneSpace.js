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
	var title = params[0] ? params[0] : config.macros.clone.title;
	//#var title = config.macros.testMacro.title;
	//#var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick,null,null,this.accessKey);
	var btn = createTiddlyButton(place,this.label,this.prompt,this.onClick);
	btn.setAttribute("title",title);
	btn.setAttribute("params",params.join("|"));
};

config.macros.clone.onClick = function(e)
{
	var title = this.getAttribute("title");
	var params = this.getAttribute("params").split("|");
	config.macros.clone.test(title,params);
	return false;
};

config.macros.clone.test = function(title,params)
{
	clearMessage();
	displayMessage("Testing");
	var adaptor = new config.adaptors['tiddlyspace']();
	var context = {};
	context.status = true;
	context.host = config.macros.clone.host;
	context.original = config.macros.clone.original;
	var ret = adaptor.getRecipe(context,null,config.macros.clone.testcallback);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.clone.testcallback = function(context,userParams)
{
	displayMessage("Testing callback");
console.log('original recipe',context.recipe);
	context.recipe.policy.manage = config.macros.clone.manage;
	context.recipe.policy.owner = config.macros.clone.owner;
	var recipes = context.recipe.recipe;
	for(var i=0;i<recipes.length;i++) {
		bag = recipes[i];
		console.log('bag',bag);
		if(bag[0]==config.macros.clone.original) {
			bag[0] = config.macros.clone.clone;
			break;
		}
	}
	//console.log('clone recipe',context.recipe);
	console.bag = config.macros.clone.original;
	var ret = context.adaptor.getTiddlers(context,null,config.macros.clone.testcallback2);
	if(ret !== true)
		displayMessage(ret);
};

config.macros.clone.testcallback2 = function(context,userParams)
{
	displayMessage("Testing callback2");
console.log('callback2 tiddlers',context.tiddlers);
	for(var i=0;i<context.tiddlers.length;i++) {
		console.log('tt',context.tiddlers[i].title);
	}
};

/*}}}*/
