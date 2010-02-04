/***
|''Name:''|TiddlySpaceAdaptor|
|''Description:''|Adaptor for moving and converting data from TiddlySpace|
|''Version:''|0.0.1|
|''Date:''|Feb 4, 2010|
|''License:''|[[Creative Commons Attribution-ShareAlike 2.5 License|http://creativecommons.org/licenses/by-sa/2.5/]] |

***/

/*{{{*/

//# Ensure that the plugin is only installed once.
if(!config.adaptors.tiddlyspace) {

config.adaptors.tiddlyspace = function() {};

(function(adaptor) {

adaptor.prototype = new AdaptorBase();

adaptor.serverType = 'tiddlyspace';
adaptor.mimeType = "application/json";
adaptor.serverParsingErrorMessage = "Error parsing result from server";
adaptor.errorInFunctionMessage = "Error in function TiddlySpaceAdaptor.%0";

adaptor.minHostName = function(host)
{
	return host ? host.replace(/^http:\/\//,'').replace(/\/$/,'') : '';
};

adaptor.prototype.getRecipe = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0/recipes/%1.%2';
	var uri = uriTemplate.format([context.host,context.original,context.format||"json"]);
//console.log("uri:"+uri);
	var req = httpReq('GET',uri,adaptor.getRecipeCallback,context);
	return typeof req == 'string' ? req : true;
};

adaptor.getRecipeCallback = function(status,context,responseText,uri,xhr)
{
//console.log('getRecipeCallback status:'+status);
//console.log(responseText);
	context.status = false;
	if(status) {
		var recipe = null;
		try {
			eval('recipe=' + responseText);
			context.recipe = recipe;
			//context.recipe = jQuery.parseJSON( responseText )
		} catch (ex) {
			context.statusText = exceptionText(ex,adaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

adaptor.prototype.putRecipe = function(context,userParams,callback)
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0/recipes/%1.%2';
	var uri = uriTemplate.format([context.host,context.original,context.format||"json"]);
//console.log("uri:"+uri);
	var headers = null;
	var payload = jQuery.toJSON(payload);
	var req = httpReq("PUT",uri,adaptor.putRecipeCallback,context,headers,payload,adaptor.mimeType,null,null,true);
	return typeof req == 'string' ? req : true;
};

adaptor.putRecipeCallback = function(status,context,responseText,uri,xhr)
{
//console.log('putRecipeCallback status:'+status);
//console.log(responseText);
	context.status = false;
	if(status) {
		var content = null;
		try {
		} catch (ex) {
			context.statusText = exceptionText(ex,adaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

adaptor.prototype.getTiddlers = function(context,userParams,callback)
// get tiddlers in a bag
{
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0/bags/%1/tiddlers.%2';
	var uri = uriTemplate.format([context.host,context.original,context.format||"json?fat=1"]);
//console.log("uri:"+uri);
	var req = httpReq('GET',uri,adaptor.getTiddlersCallback,context);
	return typeof req == 'string' ? req : true;
};

adaptor.getTiddlersCallback = function(status,context,responseText,uri,xhr)
{
//console.log('getTiddlersCallback status:'+status);
//console.log(responseText);
	context.status = false;
	if(status) {
		var tiddlers = null;
		try {
			eval('tiddlers=' + responseText);
			context.tiddlers = tiddlers;
			//context.tiddlers = jQuery.parseJSON( responseText )
		} catch (ex) {
			context.statusText = exceptionText(ex,adaptor.serverParsingErrorMessage);
			if(context.callback)
				context.callback(context,context.userParams);
			return;
		}
		context.status = true;
	} else {
		context.statusText = xhr.statusText;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

})(config.adaptors.tiddlyspace);
} // end of 'install only once'

/*}}}*/
