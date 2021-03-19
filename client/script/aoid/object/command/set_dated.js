function AoidCommandSetDateD(master, command){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cd();
	
	this.yE = c("input");
	this.yE.type = "number";
	this.yE.step = 1;
	this.yE.value = 2000;
	
	this.mE = c("input");
	this.mE.type = "number";
	this.mE.step = 1;
	this.mE.value = 1;
	
	this.dE = c("input");
	this.dE.type = "number";
	this.dE.step = 1;
	this.dE.value = 1;
	
	this.setB = cb();
	this.nowB = cb();
	this.updateStr = function () {
		this.yE.title = trans.get(323);
		this.mE.title = trans.get(324);
		this.dE.title = trans.get(325);
		this.nowB.innerHTML = trans.get(313);
		this.nowB.title = trans.get(329);
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
		this.yE.value = Math.floor(v / DAYS_IN_YEAR);
		this.mE.value = Math.floor((v % DAYS_IN_YEAR) / DAYS_IN_MONTH);
		this.dE.value = v % DAYS_IN_MONTH;
	};
	this.pasteCurrentDate = function(){
		let dt = new Date();
		this.yE.value = dt.getFullYear();
		this.mE.value = dt.getMonth() + 1;
		this.dE.value = dt.getDate();
	};
	this.sendRequestSet = function () {
		let y = parseInt(this.yE.value);
		let m = parseInt(this.mE.value);
		let d = parseInt(this.dE.value);
		let good_param = true;
		if(isNaN(y) || y < 2000 || y > 2099) {console.warn("bad year"); blinkElemBad(this.yE); good_param = false;}
		if(isNaN(m) || m < 1 || m > 12) {console.warn("bad month"); blinkElemBad(this.mE); good_param = false;}
		if(isNaN(d) || d < 1 || d > getDaysInMonth(y, m)) {console.warn("bad day"); blinkElemBad(this.dE); good_param = false;}
		if(!good_param) return;
		let v = DAYS_IN_YEAR * (y-2000) + DAYS_IN_MONTH * m + d;
		let request = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.master.app_id, this.master.id, v]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.master.peer, request);
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemGood(this.yE);blinkElemGood(this.mE);blinkElemGood(this.dE);
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
				blinkElemBad(this.yE);blinkElemBad(this.mE);blinkElemBad(this.dE);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.nowB.onclick = ()=>{
		this.pasteCurrentDate();
	};
	this.setB.onclick = ()=>{
		this.sendRequestSet();
	};
	let scont = cd();
	a(scont, [this.yE, this.mE, this.dE]);
	a(this.container, [scont, this.nowB, this.setB]);
	cla(scont, "at_line");
	cla([this.yE, this.mE, this.dE], "pr_setelem");
	cla([this.nowB, this.setB], "pr_button");
	cla(this.container, "at_line");
	this.updateStr();
}
