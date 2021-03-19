function AoidCommandSetTodS(master, command){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cd();
	this.hE = c("input");
	this.hE.type = "number";
	this.hE.step = 1;
	this.hE.value = 0;
	
	this.mE = c("input");
	this.mE.type = "number";
	this.mE.step = 1;
	this.mE.value = 0;
	
	this.sE = c("input");
	this.sE.type = "number";
	this.sE.step = 1;
	this.sE.value = 0;
	
	this.nowB = cb();
	this.setB = cb();
	
	this.updateStr = function () {
		this.hE.title = trans.get(326);
		this.mE.title = trans.get(327);
		this.sE.title = trans.get(328);
		this.nowB.innerHTML = trans.get(313);
		this.nowB.title = trans.get(330);
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
						this.updateInputs(data.content);
					}
					return true;
				}
				break;
			case CMD_AOID_SET_RAM_VALUE:
				if(data.name == CMD_AOID_GET_RAM_VALUE){
					if(data.content !== null){
						this.updateInputs(data.content);
					}
					return true;
				}
				break;
		}
		return false;
	};
	this.updateInputs = function(v){
		this.hE = Math.floor(v / SECONDS_IN_HOUR);
		this.mE = Math.floor((v % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE);
		this.sE = v % SECONDS_IN_MINUTE;
	};
	this.pasteCurrentTime = function(){
		let dt = new Date();
		this.hE.value = dt.getHours();
		this.mE.value = dt.getMinutes();
		this.sE.value = dt.getSeconds();
	};
	this.sendRequestSet = function () {
		let h = parseInt(this.hE.value);
		let m = parseInt(this.mE.value);
		let s = parseInt(this.sE.value);
		let good_param = true;
		if(isNaN(h) || h < 0 || h > 23) {console.warn("bad hour"); blinkElemBad(this.hE); good_param = false;}
		if(isNaN(m) || m < 0 || m > 59) {console.warn("bad minute"); blinkElemBad(this.mE); good_param = false;}
		if(isNaN(s) || s < 0 || s > 59) {console.warn("bad second"); blinkElemBad(this.sE); good_param = false;}
		if(!good_param) return;
		let v = SECONDS_IN_HOUR * h + SECONDS_IN_MINUTE * m + s;
		let request = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.master.app_id, this.master.id, v]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.master.peer, request);
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemGood([this.hE, this.mE, this.sE]);
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
	this.nowB.onclick = ()=>{
		this.pasteCurrentTime();
	};
	this.setB.onclick = ()=>{
		this.sendRequestSet();
	};
	let scont = cd();
	a(scont, [this.hE, this.mE, this.sE]);
	a(this.container, [scont, this.nowB, this.setB]);
	cla(scont, "at_line");
	cla([this.hE, this.mE, this.sE], "pr_setelem");
	cla([this.nowB, this.setB], "pr_button");
	cla(this.container, "at_line");
	this.updateStr();
}
