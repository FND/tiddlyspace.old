config.defaultCustomFields['server.type'] = 'tiddlyweb';
config.macros.ccLogin.sha1 = false;

config.adaptors.tiddlyweb.prototype.login = function(context,userParams,callback){
	if(window.location.search.substring(1))
		var uriParams = window.location.search.substring(1);
	else
		var uriParams = "";
	context = this.setContext(context,userParams,callback);
	var uriTemplate = '%0/challenge/cookie_form?'+uriParams;
	var uri = uriTemplate.format([context.host]);
	var req = httpReq("POST", uri, config.adaptors.tiddlyweb.loginCallback,
	context, null, 'user='+context.username+'&password='+context.password, null, null, null, true);
};

config.adaptors.tiddlyweb.loginCallback = function(status,context,responseText,uri,xhr){
console.log('made it to here ', xhr.status);
	if(xhr.status!=200){
		alert('login failed!');
		context.status = false;
	}else{
		alert('Login OK!');
		context.status = true;
	}
	if(context.callback)
		context.callback(context,context.userParams);
};

