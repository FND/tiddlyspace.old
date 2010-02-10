config.macros.cloneSpace = {
	'wizardTitle':'Clone Space',
	'step1Title':'enter new space name',
	'step1Html':'<input name="cloneName">',
	'cloneButtonText':'Clone Space', 
	'cloneButtonCaption':'click to clone this space',
	'createButtonText':'Create New Space',
	'createButtonCaption':'click to create a new space'
		
};
config.macros.cloneSpace.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	me = config.macros.cloneSpace;
	var w = new Wizard();
	w.createWizard(place,me.wizardTitle);
	w.addStep(me.step1Title,me.step1Html);
	w.setButtons(
	[{caption: me.createButtonText, tooltip: me.createButtonCaption, onClick: function() {me.doCreate(w);} },
	{caption: me.cloneButtonText, tooltip: me.cloneButtonCaption, onClick: function() {me.doClone(w);} }
]
)
}

config.macros.cloneSpace.doCreate = function(w) {
	var spaceName = w.getValue('cloneName').value;

	// call bens code 
	jQuery.ajax({type:'POST', url:'/spaces', data:{'name':spaceName}, success:function(response) {
		if(response.status=='303')
			alert('space has been created');
		else 
			alert('there was a problem creating the space');
	}, error:function(response){
			alert('there was a problem creating your space');
	}});

	w.addStep('created', 'created '+spaceName);

};

config.macros.cloneSpace.doClone = function(w) {
	console.log(w.getValue('cloneName').value);
	// call bens code 
	// call martins code 
};
