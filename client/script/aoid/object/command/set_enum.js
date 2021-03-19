function AoidCommandSetEnum(master, command, list){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cd();
	this.setB = cb();
	this.setE = new SelectElement(list, 1, "pr_setelem5", null);
	this.updateStr = function () {
		this.setE.updateStr(300);
		this.setB.innerHTML = trans.get(314);
		this.setB.title = trans.getFrom(aoid_command_dict, this.command);
	};
	this.getData = function(){
		return {name: this.command, content:null}; 
	};
	this.updateValues = function(){
		;
	};
	this.setValues = function(data){
		switch(this.command){
			case CMD_AOID_SET_NVRAM_VALUE:
				if(data.name == CMD_AOID_GET_NVRAM_VALUE){
					if(data.content !== null){
						this.setE.setValue(data.content);
					}
					return true;
				}
				break;
			case CMD_AOID_SET_RAM_VALUE:
				if(data.name == CMD_AOID_GET_RAM_VALUE){
					if(data.content !== null){
						this.setE.setValue(data.content);
					}
					return true;
				}
				break;
		}
		return false;
	};
	this.sendRequestSet = function () {
		let v = this.setE.getValue();
		if(v === null) return;
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.master.app_id, this.master.id, v]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.master.peer, d);
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemGood(this.setE);
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
		 }
		 cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemBad(this.setE);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.setB.onclick = ()=>{
		this.sendRequestSet();
	};
	a(this.container, [this.setE, this.setB]);
	cla(this.setE, "pr_setelem");
	cla(this.setB, "pr_button");
	cla(this.container, "at_line");
	this.updateStr();
}
