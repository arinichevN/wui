function SerialGroup(peer, channel, dev_list, rate_list, config_list, kind_list, enable_list) {
	this.container = new GroupElem();
	this.channel2 = {id:null};
	this.idE = new SelectElem(dev_list, 1, "pr_idelem", this.channel2);
	this.DEFAULT_ID = 1;
	this.rate = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_GET_APP_SERIAL_RATE, CMD_SET_APP_SERIAL_RATE, rate_list);
	this.config = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_GET_APP_SERIAL_CONFIG, CMD_SET_APP_SERIAL_CONFIG, config_list);
	this.kind = new ParamElemGSEnum2(peer, channel, this.channel2, CMD_GET_APP_SERIAL_KIND, CMD_SET_APP_SERIAL_KIND, kind_list);
	this.updateStr = function () {
		this.container.updateStr(trans.get(330));
		this.idE.updateStr(trans.get(302));
		this.rate.updateStr(trans.get(331)); 
		this.config.updateStr(trans.get(332)); 
		this.kind.updateStr(trans.get(333)); 
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
	
	this.container.a([this.idE, this.rate, this.config, this.kind]);
	cla(this.idE, ["pr_idelem"]);
}
