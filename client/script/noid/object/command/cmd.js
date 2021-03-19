function NoidCommandCmd(master, command){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cb();
	this.updateStr = function () {
		this.container.innerHTML = trans.getFrom(noid_command_dict, this.command);
		this.container.title = trans.get(315);
	};
	this.getData = function(){
		;
	};
	this.updateValues = function(){
		;
	};
	this.sendRequest = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.id]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.peer, d);
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemGood(this.container);
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
				blinkElemBad(this.container);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.container.onclick = ()=>{
		this.sendRequest();
	};
	cla(this.container, "pr_button");
	this.updateStr();
}
