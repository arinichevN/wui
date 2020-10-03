function ParamElemGetSupportedCommands(peer, app, slave) {
	this.peer = peer;
	this.app = app;
	this.slave = slave;
	
	this.total_count = 0;
	this.id = 0;
	this.count = 0;
	
	this.container = cd();
	this.getB = cb("");
	this.blink_tm = 200;
	
	this.cmdd = new CommandDetector(peer, [{elem: this.getB, commands: [CMD_.GET_APP_SERVER_COMMAND_COUNT, CMD_.GET_APP_SERVER_COMMAND_FIRST, CMD_.GET_APP_SERVER_COMMAND_NEXT]}]);
	
	this.ACTION =
		{
			GET_COUNT: 1,
			GET_FIRST: 2,
			GET_NEXT: 3
		};
	this.updateStr = function () {
		this.getB.innerHTML =  trans.get(420);
	};
	//this.markAllCommandsUnsupported = function(){
		//this.slave.markAllCommandsUnsupported();
	//};
	this.sendRequestGetCount = function () {
		if(this.app.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_SERVER_COMMAND_COUNT, this.app.id );
		console.log("send count: ", pack);
		var data = [
			{
				action: ['get_data'],
				param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
			}
		];
		cursor_blocker.enable();
		sendTo(this, data, this.ACTION.GET_COUNT, 'server');
	};
    this.sendRequestGetFirst = function () {
		if(this.app.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_SERVER_COMMAND_FIRST, this.app.id );
		console.log("send first: ", pack);
		var data = [
			{
				action: ['get_data'],
				param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
			}
		];
		cursor_blocker.enable();
		sendTo(this, data, this.ACTION.GET_FIRST, 'server');
	};
    this.sendRequestGetNext = function () {
		if(this.app.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestIII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_SERVER_COMMAND_NEXT, this.app.id, this.id );
		console.log("send next: ", pack);
		var data = [
			{
				action: ['get_data'],
				param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
			}
		];
		cursor_blocker.enable();
		sendTo(this, data, this.ACTION.GET_NEXT, 'server');
	};
	this.parseACPIntSucc = function(v){
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var app_id = parseInt(data[0].v1);
				var id_next = parseInt(data[0].v2);
				var success = parseInt(data[0].v3);
				if(!(isNaN(app_id) || isNaN(id_next) || isNaN(success))){
					if(app_id == this.app.id){
						if(success){
							return id_next;
						}else{
							console.warn("response: not successful");
						}
					}else{
						console.warn("response: bad app_id", app_id, this.app.id);
					}
				}
			}
		}
		return null;
	};
	this.parseACPInt = function(v){
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseInt(data[0].v2);
				if(!(isNaN(id) || isNaN(val))){
					if(id == this.app.id){
						return val;
					}
				}
			}
		}
		return null;
	};
	this.parseCount = function(v){
		var c = this.parseACPInt(v);
		if(c !== null){
			this.total_count = c; console.log("channel count: ", this.total_count);
			return 1;
		}
		console.warn("channel count: failed");
		return 0;
	};
	this.markSupported = function (command){
		this.slave.markSupportedCommand(command);
	};
	this.markCommand = function(v){
		var command = this.parseACPInt(v);
		if(command !== null){
			this.id = command;
			console.log("markCommand with id = ", this.id, ":");
			this.markSupported(this.id);
			return 1;
		}
		console.warn("markCommand: failed");
		return 0;
	};
	this.markCommandNext = function(v){
		var command = this.parseACPIntSucc(v);
		if(command !== null){
			this.id = command;
			console.log("markCommandNext with id = ", this.id, ":");
			this.markSupported(this.id);
			return 1;
		}
		console.warn("markCommandNext: failed");
		return 0;
	};
	this.updateFailed = function(){
		this.count = 0;
		blink(this.getB, "pr_failed", this.blink_tm);
	};
	
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				if(this.markCommandNext(d)){
					if(this.count < this.total_count){
						this.count++;
						this.sendRequestGetNext();
					}else{
						this.slave.showSupported();
					}
				}else{
					console.warn("failed to mark channel1");
					this.updateFailed();
				}
				break;
			case this.ACTION.GET_COUNT:
				if(this.parseCount(d)){
					if(this.count < this.total_count){
						this.count++;
						this.sendRequestGetFirst();
					}
				}else{
					console.warn("failed to get count");
					this.updateFailed();
				}
				break;
			case this.ACTION.GET_FIRST:
				if(this.markCommand(d)){
					if(this.count < this.total_count){
						this.count++;
						this.sendRequestGetNext();
					}
				}else{
					console.warn("failed to mark channel2");
					this.updateFailed();
				}
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
         }
         cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				console.warn("abort: next");
				this.updateFailed();
				break;
			case this.ACTION.GET_COUNT:
				console.warn("abort: count");
				this.updateFailed();
				break;
			case this.ACTION.GET_FIRST:
				console.warn("abort: first");
				this.updateFailed();
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.getB.onclick = function(){
		self.slave.markAllCommandsUnsupported();
		self.slave.hideUnsupported();
		self.count = 0;
		self.sendRequestGetCount();
		
	};
	a(this.container, [this.getB]);
	cla(this.container, ["pr"]);
	cla([this.getB],["pr_button"]);
}
