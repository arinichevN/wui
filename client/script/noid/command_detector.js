function NoidCommandDetector(expected_commands){
	this.commands = expected_commands;
	this.ACTION = {GET_FIRST:1, GET_NEXT:2};
	this.peer = null;
	this.slave = null;
	this.obj_id = null;
	this.notifySlave = function(command_id){
		for(let i=0; i<this.commands.length; i++){
			if(this.commands[i] === command_id){
				this.slave.commandSupported(command_id);
				//console.log("supported command:", command_id);
				return;
			}
		}
		console.warn("NOID command ", command_id, "is not supported by this application");
	};
	this.commandSupported = function(v){
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				let obj_id = parseInt(data[0].v1);
				let cmd_id = parseInt(data[0].v2);
				if(!(isNaN(obj_id) || isNaN(cmd_id))){
					if(obj_id === this.obj_id){
						if(cmd_id === CMD_NONE) return;
						console.log(this.obj_id, "it is", cmd_id);
						this.notifySlave(cmd_id);
						this.sendRequestGetNext(cmd_id);
						return;
					}else{
						console.warn("bad object id");
					}
				} else {
					console.warn("bad data");
				}
			}
		}
		console.warn("failed to check supported command");
	};
	this.sendRequestGetFirst = function(command) {
		//console.log(this.obj_id, "first?");
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_NOID_GET_ACP_COMMAND_SUPPORTED_FIRST, this.obj_id]);
		remoteGetAcpData_bl(this, this.ACTION.GET_FIRST, this.peer, d);
	};
	this.sendRequestGetNext = function(command) {
		//console.log(this.obj_id, "next after", command, "?");
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_NOID_GET_ACP_COMMAND_SUPPORTED_NEXT, this.obj_id, command]);
		remoteGetAcpData_bl(this, this.ACTION.GET_NEXT, this.peer, d);
	};
	this.checkCommands = function(slave, peer, obj_id){
		this.slave = slave;
		this.peer = peer;
		this.obj_id = obj_id;
		this.sendRequestGetFirst();
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				this.commandSupported(d);
				break;
			case this.ACTION.GET_FIRST:
				this.commandSupported(d);
				break;
			default:
				console.warn("confirm: unknown action: ", action);
				break;
		 }
		 cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				console.warn("failed to get next supported command");
				break;
			case this.ACTION.GET_FIRST:
				console.warn("failed to get first supported command");
				break;
			default:
				console.warn("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
}
