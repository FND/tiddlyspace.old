// ccRegister //

//{{{
config.macros.register ={
	usernameRequest:"username",
	passwordRequest:"password",
	passwordConfirmationRequest:"confirm password",
	emailRequest:"email",
	stepRegisterTitle:"Register for an account.",
	stepRegisterIntroText:"Hi, please register below.... ",
	stepRegisterHtml:"<label> username</label><input class='input' id='reg_username' name='reg_username' tabindex='1'/><span></span><input type='hidden'  name='username_error'></input><br /><label>email</label><input class='input' name=reg_mail id='reg_mail' tabindex='2'/><span> </span><input type='hidden' name='mail_error'></input><br/><label>password</label><input type='password' class='input' id='password1' name='reg_password1' tabindex='3'/><span> </span><input type='hidden'  name='pass1_error'></input><br/><label>confirm password</label><input type='password' class='input' id='password2' name='reg_password2' tabindex='4'/><span> </span><input type='hidden'  name='pass2_error'></input>",
	buttonCancel:"Cancel",
	buttonCancelToolTip:"Cancel transaction ",
	buttonRegister:"Register",	
	buttonRegisterToolTip:"click to register",
	msgCreatingAccount:"Attempting to create the account for you.", 
	msgNoUsername:"No username entered", 
	msgEmailOk:"Email address is OK.",
	msgNoPassword:"no password entered.",
	msgDifferentPasswords:"Your Passwords do not match.",
	msgUsernameTaken:"The username requested has been taken.",
	msgUsernameAvailable:"The username is available.",
	step2Title:"",
	step2Html:"Please wait while we create you an account...",
	errorRegisterTitle:"Error",
	errorRegister:"User not created, please try again with a different username."
};

config.macros.register.handler=function(place,macroName,params,wikifier,paramString,tiddler){
	var w = new Wizard();
	w.createWizard(place,config.macros.register.stepRegisterTitle);
	config.macros.register.displayRegister(place,w);
};

config.macros.register.displayRegister=function(place, w){
	var me = config.macros.register;
	w.addStep(me.stepRegisterIntroText, me.stepRegisterHtml);
	w.formElem["reg_username"].onkeyup=function() {
		var context = {};
		context.username = w.formElem["reg_username"].value;
		context.w = w;
		config.adaptors[config.defaultCustomFields['server.type']].isUsernameAvaliable(context, null,config.macros.register.isUsernameAvailabeCallback);
	};
	w.setButtons([
		{caption: me.buttonRegister, tooltip: me.buttonRegisterToolTip, onClick:function() { me.doRegister(place, w)}},
		{caption: me.buttonCancel, tooltip: me.buttonCancelToolTip, onClick: function() { config.macros.ccLogin.refresh(place)}}
	]);
}

config.macros.register.setStatus=function(w, element, text){
	var label_var = w.getElement(element);
	removeChildren(label_var.previousSibling);
	var label = document.createTextNode(text);
	label_var.previousSibling.insertBefore(label,null);
}

config.macros.register.doRegister=function(place, w){
	var me = config.macros.register;
	if(w.formElem["reg_username"].value==''){
		me.setStatus(w, "username_error", me.msgNoUsername);
	}else {
		me.setStatus(w, "username_error", "");
	}
	if(me.emailValid(w.formElem["reg_mail"].value)){
		me.setStatus(w, "mail_error", me.msgEmailOk);
	}else{
		me.setStatus(w, "mail_error", "invalid email address");
		return false;
	}
	if(w.formElem["reg_password1"].value==''){
		me.setStatus(w, "pass1_error", me.msgNoPassword);
		return false;
	}else{
		me.setStatus(w, "pass1_error", "");
	}
	if(w.formElem["reg_password2"].value==''){
		me.setStatus(w, "pass2_error", me.msgNoPassword);
		return false;
	}
	if(w.formElem["reg_password1"].value != w.formElem["reg_password2"].value ){
		me.setStatus(w, "pass1_error", me.msgDifferentPasswords);
		me.setStatus(w, "pass2_error", me.msgDifferentPasswords);
		return false;
	}
 	var params ={};
	params.p = Crypto.hexSha1Str(w.formElem['reg_password1'].value);
	params.u = w.formElem['reg_username'].value;
	params.place = place;
	params.w = w;
	context = {};
	context.username = w.formElem['reg_username'].value;
	context.password = w.formElem['reg_password1'].value;
	context.mail = w.formElem['reg_mail'].value; 
	config.adaptors[config.defaultCustomFields['server.type']].doRegister(context);
	
	//var loginResp=doHttp('POST',url+'/handle/register.php',"username="+w.formElem['reg_username'].value+"&reg_mail="+w.formElem['reg_mail'].value+"&password="+Crypto.hexSha1Str(w.formElem['reg_password1'].value)+"&password2="+Crypto.hexSha1Str(w.formElem['reg_password2'].value),null,null,null,config.macros.register.registerCallback,params);
	w.addStep(me.step2Title, me.msgCreatingAccount);
	w.setButtons([
		{caption: me.buttonCancel, tooltip: me.buttonCancelToolTip, onClick: function() {config.macros.ccLogin.refresh(place);}
	}]);
}

config.macros.register.emailValid=function(str){
	if((str.indexOf(".") > 0) && (str.indexOf("@") > 0))
		return true;
	else
		return false;
};

config.macros.register.usernameValid=function(str){
	if((str.indexOf("_") > 0) && (str.indexOf("@") > 0))
		return false;
	else
		return true;
};

config.macros.register.registerCallback=function(status,params,responseText,uri,xhr){
	var userParams = {};
	userParams.place = params.place;
	if (xhr.status==304){
		params.w.addStep(config.macros.register.errorRegisterTitle, config.macros.register.errorRegister);
		return false;
	}	
	var adaptor = new config.adaptors[config.defaultCustomFields['server.type']];
	var context = {};
	context.host = window.url;
	context.username = params.u;
	context.password = params.p;
	adaptor.login(context,userParams,config.macros.ccLogin.loginCallback);
	return true;
}

config.macros.register.isUsernameAvailabeCallback=function(status,params,responseText,uri,xhr){
	
console.log('herehehre', status, params);
var me = config.macros.register;
	var resp = (params.status == true) ? me.msgUsernameTaken : me.msgUsernameAvailable;
	config.macros.register.setStatus(params.w, "username_error", resp);
};

//}}}

