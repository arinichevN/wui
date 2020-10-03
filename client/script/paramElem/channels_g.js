function ChannelIdView(channel_id, master, slave){
	this.id = channel_id;
	this.master = master;
	this.slave = slave;
	
	this.selected = false;
	
	this.container = cd();
	this.container.innerHTML = this.id;
	this.disable = function(){
		clr(this.container, "ch_elem_selected");
		this.selected = false;
	};
	this.enable = function(){
		this.master.disableOthers();
		this.slave.id = this.id; 
		this.slave.elem.value = this.slave.id;
		cla(this.container, "ch_elem_selected");
		this.selected = true;
	};
	this.ontouch = function(){
		if(!this.selected){
			this.enable();
		}
	};
	
	var self = this;
	this.container.onclick = function(){
		self.ontouch();
	};
	cla(this.container, "ch_elem");
}

function ParamElemGChannels(peer, app, slave) {
	this.peer = peer;
	this.app = app;
	this.slave = slave;
	
	this.channel_count = 0;
	this.channel_id = 0;
	this.count = 0;
	
	this.container = cd();
	this.elemsCont = cd();
	this.elements = [];
    this.getB = cb("");
    this.UNKNOWN_STR = "&empty;";
    this.getB.innerHTML =  this.UNKNOWN_STR;
    this.blink_tm = 200;
    
    this.cmdd = new CommandDetector(peer, [{elem: this.getB, commands: [CMD_.GET_APP_CHANNEL_COUNT,CMD_.GET_APP_CHANNEL_ID_FIRST,CMD_.GET_APP_CHANNEL_ID_NEXT]}]);
	
    this.ACTION =
		{
			GET_COUNT: 1,
			GET_FIRST: 2,
			GET_NEXT: 3
		};
    this.updateStr = function () {
		this.getB.innerHTML = trans.get(416);
	};
	this.sendRequestGetCount = function () {
		if(this.app.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_CHANNEL_COUNT, this.app.id );
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
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_CHANNEL_ID_FIRST, this.app.id );
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
		var pack = acp_buildRequestIII(ACPP_SIGN_REQUEST_GET, CMD_.GET_APP_CHANNEL_ID_NEXT, this.app.id, this.channel_id );
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
    this.parseACPNextChannelId = function(v){
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var app_id = parseInt(data[0].v1);
				var channel_id_next = parseInt(data[0].v2);
				var success = parseInt(data[0].v3);
				if(!(isNaN(app_id) || isNaN(channel_id_next) || isNaN(success))){
					if(app_id == this.app.id){
						if(success){
							return channel_id_next;
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
			this.channel_count = c; console.log("channel count: ", this.channel_count);
			return 1;
		}
		console.warn("channel count: failed");
		return 0;
	};
	this.clearElems = function(){
		cleara(this.elements);
		clearCont(this.elemsCont);
	};
	this.updateFailed = function(){
		this.clearElems();
		this.count = 0;
		blink(this.getB, "pr_failed", this.blink_tm);
	};
	this.disableOthers = function(){
		for(var i=0; i<this.elements.length; i++){
			var element = this.elements[i];
			if(element.selected){
				element.disable();
			}
		}
	};
	this.addNewElement = function(){
		var elem = new ChannelIdView(this.channel_id, this, this.slave);
		this.elements.push(elem);
		a(this.elemsCont, elem);
	};
	this.addChannel = function(v){
		var channel_id = this.parseACPInt(v);
		if(channel_id !== null){
			this.channel_id = channel_id;
			this.addNewElement();
			console.log("addChannel with id = ", this.channel_id);
			return 1;
		}
		console.warn("addChannel: failed");
		return 0;
	};
	this.addChannelNext = function(v){
		var channel_id = this.parseACPNextChannelId(v);
		if(channel_id !== null){
			this.channel_id = channel_id;
			this.addNewElement();
			console.log("addChannel with id = ", this.channel_id);
			return 1;
		}
		console.warn("addChannel: failed");
		return 0;
	};
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				if(this.addChannelNext(d)){
					if(this.count < this.channel_count){
						this.count++;
						this.sendRequestGetNext();
					}
				}else{
					console.warn("failed to add channel1");
					this.updateFailed();
				}
				break;
			case this.ACTION.GET_COUNT:
				if(this.parseCount(d)){
					if(this.count < this.channel_count){
						this.count++;
						this.sendRequestGetFirst();
					}
				}else{
					console.warn("failed to get count");
					this.updateFailed();
				}
				break;
			case this.ACTION.GET_FIRST:
				if(this.addChannel(d)){
					if(this.count < this.channel_count){
						this.count++;
						this.sendRequestGetNext();
					}
				}else{
					console.warn("failed to add channel2");
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
		self.clearElems();
		self.count = 0;
		self.sendRequestGetCount();
	};
	a(this.container, [this.elemsCont, this.getB]);
	cla(this.container, ["pr"]);
	cla(this.elemsCont, ["ch_cont"]);
	cla([this.getB],["pr_button"]);
}
