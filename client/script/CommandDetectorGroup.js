function CommandDetectorGroup(elements){
	this.elements = elements;
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
	this.isSupportedAny = function(){
		for(var i=0; i<this.elements.length; i++){
			if(this.elements[i].cmdd.isSupportedAny()){
				return true;
			} 
		}
		return false;
	};
}
