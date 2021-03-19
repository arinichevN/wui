function NoidCommandDetector(commands){
	this.commands = commands;
	this.ACTION = {CHECK: 5};
	this.ind = 0;
	this.peer = null;
	this.slave = null;
	this.obj_id = null;
	this.commandSupported = function(v){
		let command_id = this.commands[this.ind];
		let supported = 0;
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				let obj_id = parseInt(data[0].v1);
				let cmd_id = parseInt(data[0].v2);
				let supp = parseInt(data[0].v3);
				if(!(isNaN(obj_id) || isNaN(cmd_id) || isNaN(supp))){
					if(obj_id === this.obj_id && cmd_id === command_id){
						supported = supp;
					}
				}
			}
		}
		this.slave.commandSupported(command_id, supported);
		this.checkNextCommand();
	};
	this.checkNextCommand = function(){
		this.ind++;
		if(this.ind < this.commands.length){
			this.sendRequest(this.commands[this.ind]);
		}
	};
	this.sendRequest = function(command) {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_NOID_GET_ACP_COMMAND_SUPPORTED, this.obj_id, command]);
		remoteGetAcpData_bl(this, this.ACTION.CHECK, this.peer, d);
	};
	this.checkCommands = function(slave, peer, obj_id){
		this.slave = slave;
		this.peer = peer;
		this.obj_id = obj_id;
		this.ind = 0;
		if(this.ind < this.commands.length){
			this.sendRequest(this.commands[this.ind]);
		}
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.CHECK:
				this.commandSupported(d);
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
		 }
		 cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.CHECK:
				this.slave.commandSupported(this.commands[this.ind], 0);
				this.checkNextCommand();
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
}
