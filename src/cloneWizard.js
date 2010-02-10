config.macros.cloneSpace = {
	'wizardTitle':'Clone Space',
	'step1Title':'enter new space name',
	'step1Html':'<input name="cloneName">',
		
};
config.macros.cloneSpace.handler = function(place,macroName,params,wikifier,paramString,tiddler) {
	me = config.macros.cloneSpace;
	var w = new Wizard();
	w.createWizard(place,me.wizardTitle);
	w.addStep(me.step1Title,me.step1Html);

	w.setButtons([{caption: 'start clone', tooltip: 'click to start the clone op', onClick: function() {me.doClone(w);} }])
}

config.macros.cloneSpace.doClone = function(w) {
	console.log(w.getValue('cloneName').value);
};
