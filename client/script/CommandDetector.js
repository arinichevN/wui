function CommandDetector(peer, data){
	this.peer = peer;
	this.data = [];
	for(var i = 0; i < data.length; i++){
		var elemd = data[i].elem;
		var commandsd = data[i].commands;
		var commandsl = [];
		for(var j = 0; j < commandsd.length; j++){
			commandsl.push({name: commandsd[j], supported: false});
		}
		this.data.push({elem: data[i].elem, commands: commandsl});
	}
	this.ACTION =
		{
			CHECK_CMD: 5
		};
	
	this.markSupported = function(elem){
		clr(elem, "pr_unsupported");
	};
	this.markUnsupported = function(elem){
		cla(elem, "pr_unsupported");
	};
	this.parseCmdSupport = function(v){
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var app_id = parseInt(data[0].v1);
				var cmd_id = parseInt(data[0].v2);
				var supported = parseInt(data[0].v3);
				if(!(isNaN(app_id) || isNaN(cmd_id) || isNaN(supported))){
					if(supported){
						return 1;
					}
				}
			}
		}
		return 0;
	};

	this.sendRequestCheckCmd = function(id, command, elem_ind) {
		if(this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestIII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_ACP_COMMAND_EXISTS, id, command);
		console.log("send check: ", pack);
		var data = [
			{
				action: ['get_data'],
				param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
			}
		];
		cursor_blocker.enable();
		sendTo(this, data, elem_ind, 'server');
	};
	this.checkCommands = function(channel){
		for(var i = 0; i < this.data.length; i++){
			this.markSupported(this.data[i].elem);
		}
		for(var i = 0; i < this.data.length; i++){
			var elem = this.data[i].elem;
			var commands = this.data[i].commands;
			for(var j = 0; j < commands.length; j++){
				var command = commands[j].name;
				this.sendRequestCheckCmd(channel.id, command, i);
			}
		}
	};
	this.markAllCommandsUnsupported = function(){
		for(var i = 0; i < this.data.length; i++){
			var elem = this.data[i].elem;
			var commands = this.data[i].commands;
			for(var j = 0; j < commands.length; j++){
				var command = commands[j].name;
				command.supported = false;
			}
			this.markUnsupported(elem);
		}
	};
	this.markSupportedCommand = function(command_in){
		var matched = false;
		for(var i = 0; i < this.data.length; i++){
			var elem = this.data[i].elem;
			var commands = this.data[i].commands;
			var all_elem_commands_supported = true;
			for(var j = 0; j < commands.length; j++){
				var command = commands[j];
				if(command_in === command.name){
					command.supported = true;
					matched = true;
				} 
				if(!command.supported){
					all_elem_commands_supported = false;
					if(matched){
						console.log("unsupported command", command_in);
						return;
					}
				}
			}
			if(all_elem_commands_supported){
				console.log("all commands supported by element", command_in);
				this.markSupported(elem);
			}
			if(matched){
				console.log("command supported but not all supported", command_in);
				return;
			}
		}
	};
	this.isSupportedAny = function(){
		if(data.length < 1) return true;
		for(var i = 0; i < this.data.length; i++){
			var elem = this.data[i].elem;
			var commands = this.data[i].commands;
			var supported = true;
			for(var j = 0; j < commands.length; j++){
				var command = commands[j];
				if(!command.supported){
					supported = false;
					break;
				}
			}
			if(supported){
				return true;
			}
		}
		return false;
	};
	this.confirm = function (action, d, dt_diff) {
		var item = this.data[action];
		if(typeof(item) != "undefined"){
			if(!this.parseCmdSupport(d)){
				this.markUnsupported(item.elem);
			}
		}else{
			console.warn("confirm: bad action");
		}	
        cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		var item = this.data[action];
		if(typeof(item) != "undefined"){
			this.markUnsupported(item.elem);
		}else{
			console.warn("abort: bad action");
		}		
		cursor_blocker.disable();
	};
}
