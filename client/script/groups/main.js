function MainGroup(descr_id, elements) {
	this.descr_id = descr_id;
	this.container = new GroupElem();
	this.elements = elements;
	this.cmdd = new CommandDetectorGroup(this.elements);
	this.updateStr = function () {
		this.container.updateStr(trans.get(this.descr_id));
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].updateStr(); 
		}
	};
	this.checkCommands = function(channel){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].cmdd.checkCommands(channel); 
		}
	};
	this.markAllCommandsUnsupported = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].cmdd.markAllCommandsUnsupported(); 
		}
	};
	this.markSupportedCommand = function(command){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].cmdd.markSupportedCommand(command); 
		}
	};
	this.hideUnsupported = function(){
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].cmdd.isSupportedAny()){
				return;
			} 
		}
		cla(this.container, "hdn");
	};
	this.showSupported = function(){
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].cmdd.isSupportedAny()){
				clr(this.container, "hdn");
				return;
			} 
		}
	};
	this.showAllElements = function(){
		clr(this.container, "hdn");
	};
	this.container.a(this.elements);
}
