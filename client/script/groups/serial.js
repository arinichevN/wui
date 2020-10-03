function SerialGroup(peer, channel, descr_id) {
	this.descr_id = descr_id;
	this.container = new GroupElem();
	this.channel2 = {id:null};
	this.idE = new SelectElem(302, sdev_list, 1, "pr_idelem", this.channel2);
	this.DEFAULT_ID = 1;
	this.rate = new ParamElemGSEnum2(peer, channel, this.channel2, 331, CMD_.GET_APP_SERIAL_RATE, CMD_.SET_APP_SERIAL_RATE, srate_list);
	this.config = new ParamElemGSEnum2(peer, channel, this.channel2, 332, CMD_.GET_APP_SERIAL_CONFIG, CMD_.SET_APP_SERIAL_CONFIG, sconfig_list);
	this.mode = new ParamElemGSEnum2(peer, channel, this.channel2, 333, CMD_.GET_APP_SERIAL_MODE, CMD_.SET_APP_SERIAL_MODE, smode_list);
	this.elements = [this.rate, this.config, this.mode];
	this.cmdd = new CommandDetectorGroup(this.elements);
	this.updateStr = function () {
		this.container.updateStr(trans.get(this.descr_id));
		this.idE.updateStr(trans.get(302));
		this.rate.updateStr(trans.get(331)); 
		this.config.updateStr(trans.get(332)); 
		this.mode.updateStr(trans.get(333)); 
	};
	this.checkCommands = function(channel){
		this.cmdd.execute(this.peer, channel.id);
	};
	this.markAllCommandsUnsupported = function(){
		this.cmdd.markAllCommandsUnsupported();
	};
	this.markSupportedCommand = function(command){
		this.cmdd.markSupportedCommand(command);
	};
	this.isSupportedAny = function(){
		return this.cmdd.isSupportedAny();
	};
	this.setId = function(){
		var v = parseInt(this.idE.value);
		if(isNaN(v)){
			v = null;
		}
		this.channel2.id = v;
	};
	var self = this;
	this.valChanged = function(){
		self.setId();
	};
	
	this.container.a([this.idE, this.rate, this.config, this.mode]);
	cla(this.idE, ["pr_idelem"]);
}
