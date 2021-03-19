function NoidCommandSetInt(master, command, minv, maxv){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cd();
	this.setB = cb();
	this.setE = c("input");
	this.setE.type = "number";
	this.setE.min = minv;
	this.setE.max = maxv;
	this.minv = minv;
	this.maxv = maxv;
	this.setE.value = minv;
	this.updateStr = function () {
		this.setE.title = trans.get(300);
		this.setB.innerHTML = trans.get(314);
		this.setB.title = trans.getFrom(noid_command_dict, this.command);
	};
	this.getData = function(){
		;
	};
	this.updateValues = function(){
		;
	};
	this.sendRequestSet = function () {
		let v = parseInt(this.setE.value);
		if(isNaN(v)){return;}
		if(v < this.minv || v > this.maxv) return;
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.id, v]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.peer, d);
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
