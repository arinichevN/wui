function AoidCommandDetector(expected_commands){
	this.commands = expected_commands;
	this.ACTION = {GET_FIRST:1, GET_NEXT:2};
	this.peer = null;
	this.slave = null;
	this.app_id = null;
	this.obj_id = null;
	this.notifySlave = function(command_id){
		for(let i=0; i<this.commands.length; i++){
			if(this.commands[i] === command_id){
				this.slave.commandSupported(command_id);
				return;
			}
		}
		console.warn("AOID command ", command_id, "is not supported by this application");
	};
	this.commandSupported = function(v){
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				let app_id = parseInt(data[0].v1);
				let obj_id = parseInt(data[0].v2);
				let cmd_id = parseInt(data[0].v3);
				if(!(isNaN(app_id) || isNaN(obj_id) || isNaN(cmd_id))){
					if(app_id === this.app_id && obj_id === this.obj_id){
						if(cmd_id === CMD_NONE) return;
						this.notifySlave(cmd_id);
						this.sendRequestGetNext(cmd_id);
						return;
					}
				}
			}
		}
		console.warn("failed to check supported command");
	};
	this.sendRequestGetFirst = function() {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_AOID_GET_ACP_COMMAND_SUPPORTED_FIRST, this.app_id, this.obj_id]);
		remoteGetAcpData_bl(this, this.ACTION.GET_FIRST, this.peer, d);
	};
	this.sendRequestGetNext = function(command) {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_AOID_GET_ACP_COMMAND_SUPPORTED_NEXT, this.app_id, this.obj_id, command]);
		remoteGetAcpData_bl(this, this.ACTION.GET_NEXT, this.peer, d);
	};
	this.checkCommands = function(slave, peer, app_id, obj_id){
		this.slave = slave;
		this.peer = peer;
		this.app_id = app_id;
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
