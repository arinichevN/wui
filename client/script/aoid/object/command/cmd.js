function AoidCommandCmd(master, command){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cb();
	this.updateStr = function () {
		this.container.innerHTML = trans.getFrom(aoid_command_dict, this.command);
		this.container.title = trans.get(315);
	};
	this.getData = function(){
		return {name: this.command, content:null};
	};
	this.updateValues = function(){
		;
	};
	this.setValues = function(data){
		return false;
	};
	this.sendRequest = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_SET, this.command, this.master.master.app_id, this.master.id]);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.master.peer, d);
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
