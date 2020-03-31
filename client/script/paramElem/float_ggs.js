function ParamElemGGSFloat(peer, channel, cmd_get, cmd_getr, cmd_set) {
	this.channel = channel;
	this.peer = peer;
	this.cmd_get = cmd_get;
	this.cmd_getr = cmd_getr;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.ramE = cd();
    this.UNKNOWN_STR = "&empty;";
    this.ramE.innerHTML = this.UNKNOWN_STR;
    this.nvramE = cd();
    this.nvramE.innerHTML = this.UNKNOWN_STR;
    this.setE = c("input");
    this.setE.type = "number";
    this.setB = cb("");
    this.setE.step = 0.001;
    this.setE.value = 0;
    this.blink_tm = 200;
    this.precision = 3;
    this.ACTION =
		{
			GET: 1,
			GETR:2,
			SET: 3
		};
    this.updateStr = function (descr) {
		this.descrE.innerHTML = descr;
		this.ramE.title = trans.get(313);
		this.nvramE.title = trans.get(314);
		this.setE.title = trans.get(300);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
	this.dragStart = function(event){
		event.dataTransfer.setData("text", event.target.innerHTML);
	};
	this.allowDrop = function(event) {
	  event.preventDefault();
	};
	this.drop = function(event) {
	  event.preventDefault();
	  var data = event.dataTransfer.getData("text");
	  event.target.value = data;console.log(data);
	};
	this.sendRequestGet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildPackSI(this.cmd_get, this.channel.id );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, 'server');
    };
    this.sendRequestGetr = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildPackSI(this.cmd_getr, this.channel.id );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GETR, 'server');
    };
    this.sendRequestSet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var v = parseFloat(this.setE.value);
		if(isNaN(v) || !isFinite(v)){return;}
		var pack = acp_buildPackSIF(this.cmd_set, this.channel.id, v, this.precision);
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SET, 'server');
    };
    this.updateElemRAM = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parsePack(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseFloat(data[0].v2);
				if(!(isNaN(id) || isNaN(val) || !isFinite(val))){
					if(id == this.channel.id){
						elemv = val;
						bstyle = "pr_success";
					}
				}
			}
		}
		elem.innerHTML = elemv;
		blink(elem, bstyle, this.blink_tm);
	};
	this.updateElemNVRAM = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parsePack(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseFloat(data[0].v2);
				var status = parseInt(data[0].v3);
				if(!(isNaN(id) || isNaN(val) || !isFinite(val) || isNaN(status))){
					if(id == this.channel.id){
						if(status == 1){
							elemv = val;
							bstyle = "pr_success";
						}
					}
				}
			}
		}
		elem.innerHTML = elemv;
		blink(elem, bstyle, this.blink_tm);
	};
	this.updateElemBad = function(elem){
		elem.innerHTML = this.UNKNOWN_STR;
		blink(elem, "pr_failed", this.blink_tm);
	};
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.SET:
				blink(this.setE, "pr_success", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElemNVRAM(this.nvramE, d);
				break;
			case this.ACTION.GETR:
				this.updateElemRAM(this.ramE, d);
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
				blink(this.setE, "pr_failed", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElemBad(this.nvramE);
				break;
			case this.ACTION.GETR:
				this.updateElemBad(this.ramE);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	
	
	var self = this;
	this.nvramE.draggable = true;
	this.nvramE.ondragstart = function(event){
		self.dragStart(event);
	};
	this.ramE.draggable = true;
	this.ramE.ondragstart = function(event){
		self.dragStart(event);
	};
	this.setE.ondragover = function(event){
		self.allowDrop(event);
	};
	this.setE.ondrop = function(event){
		self.drop(event);
	};
	this.nvramE.onclick = function(){
		self.sendRequestGet();
	};
	this.ramE.onclick = function(){
		self.sendRequestGetr();
	};
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	a(this.container, [this.descrE, this.nvramE, this.ramE, this.setE, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.nvramE, this.ramE],["pr_getelem"]);
	cla([this.setE],["pr_setelem"]);
	cla([this.setB],["pr_button"]);
}
