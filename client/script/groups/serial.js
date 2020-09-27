function SerialGroup(peer, channel, dev_list, rate_list, config_list, mode_list, enable_list) {
	this.container = new GroupElem();
	this.channel2 = {id:null};
	this.idE = new SelectElem(dev_list, 1, "pr_idelem", this.channel2);
	this.DEFAULT_ID = 1;
	this.rate = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_.GET_APP_SERIAL_RATE, CMD_.SET_APP_SERIAL_RATE, rate_list);
	this.config = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_.GET_APP_SERIAL_CONFIG, CMD_.SET_APP_SERIAL_CONFIG, config_list);
	this.mode = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_.GET_APP_SERIAL_MODE, CMD_.SET_APP_SERIAL_MODE, mode_list);
	this.updateStr = function () {
		this.container.updateStr(trans.get(330));
		this.idE.updateStr(trans.get(302));
		this.rate.updateStr(trans.get(331)); 
		this.config.updateStr(trans.get(332)); 
		this.mode.updateStr(trans.get(333)); 
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
