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
		console.log(data);
		w.addStep('created', 'created '+spaceName+config.macros.createSpace.newSpaceLink.format([data]));
	}, error:function(response){
		console.log(repsonse);
		w.addStep('Error', 'There was an error creating the space '+spaceName);
	}, complete: console.log });

};

config.macros.createSpace.doClone = function(w) {
	console.log(w.getValue('cloneName').value);
	// call bens code 
	// call martins code 
};
