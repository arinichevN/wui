function ParamElemGGSTime(peer, channel, descr_id, cmd_get, cmd_getr, cmd_set) {
	this.peer = peer;
	this.channel = channel;
	this.descr_id = descr_id;
	this.cmd_get = cmd_get;
	this.cmd_getr = cmd_getr;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.SECONDS_IN_MINUTE = 60
	this.SECONDS_IN_HOUR = 3600;
    this.UNKNOWN_STR = "&empty;";
    this.nvramE = cd();
    this.nvramE.innerHTML = this.UNKNOWN_STR;
    this.ramE = cd();
    this.ramE.innerHTML = this.UNKNOWN_STR;
    this.hE = c("input");
    this.hE.type = "number";
    this.hE.step = 1;
    this.hE.value = 0;
    
    this.mE = c("input");
    this.mE.type = "number";
    this.mE.step = 1;
    this.mE.value = 0;
    
    this.sE = c("input");
    this.sE.type = "number";
    this.sE.step = 1;
    this.sE.value = 0;
    
    this.nowB = cb("");
    this.setB = cb("");
    this.cmdd = new CommandDetector(peer, [
	    {elem: this.ramE, commands: [this.cmd_getr]},
	    {elem: this.nvramE, commands: [this.cmd_get]},
	    {elem: this.setB, commands: [this.cmd_set]}
    ]);
    this.blink_tm = 200;

    this.ACTION =
		{
			SET: 1,
			GET: 2,
			GETR: 3,
			CHECK_CMD: 5
		};
    this.updateStr = function () {
		this.descrE.innerHTML = trans.get(this.descr_id);
		this.nvramE.title = trans.get(314);
		this.ramE.title = trans.get(313);
		this.hE.title = trans.get(381);
		this.mE.title = trans.get(382);
		this.sE.title = trans.get(383);
		this.nowB.innerHTML = trans.get(397);
		this.nowB.title = trans.get(399);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
	this.pasteCurrentTime = function(){
		var dt = new Date();
		this.hE.value = dt.getHours();
		this.mE.value = dt.getMinutes();
		this.sE.value = dt.getSeconds();
	};
	this._sendRequestGet = function (action, command) {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, command, this.channel.id );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, action, 'server');
    };
    this.sendRequestGet = function () {
		this._sendRequestGet(this.ACTION.GET, this.cmd_get);
	};
	this.sendRequestGetr = function () {
		this._sendRequestGet(this.ACTION.GETR, this.cmd_getr);
	};
    this.sendRequestSet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var h = parseInt(this.hE.value);
		var m = parseInt(this.mE.value);
		var s = parseInt(this.sE.value);
		var good_param = true;
		if(isNaN(h) || h < 0 || h > 23) {console.warn("bad hour"); this.updateElemBad(this.hE); good_param = false;}
		if(isNaN(m) || m < 0 || m > 59) {console.warn("bad minute"); this.updateElemBad(this.mE); good_param = false;}
		if(isNaN(s) || s < 0 || s > 59) {console.warn("bad second"); this.updateElemBad(this.sE); good_param = false;}
		if(!good_param) return;
		var v = this.SECONDS_IN_HOUR * h + this.SECONDS_IN_MINUTE * m + s;
		var pack = acp_buildRequestIII(ACPP_SIGN_REQUEST_SET, this.cmd_set, this.channel.id, v);
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SET, 'server');
    };
    this.todToStr = function(v){
		var h = v / this.SECONDS_IN_HOUR;
		var m = (v % this.SECONDS_IN_HOUR) / this.SECONDS_IN_MINUTE;
		var s = v % this.SECONDS_IN_MINUTE;
		return Math.floor(h) + ":" + Math.floor(m) + ":" + s;
	};
	this.updateElem = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseInt(data[0].v2);
				var status = parseInt(data[0].v3);
				if(!(isNaN(id) || isNaN(val) || isNaN(status))){
					if(id == this.channel.id){
						if(status == 1){
							elemv = this.todToStr(val);
							bstyle = "pr_success";
						}
					}
				}
			}
		}
		elem.innerHTML = elemv;
		blink(elem, bstyle, this.blink_tm);
	};
	this.updateElemR = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseInt(data[0].v2);
				if(!(isNaN(id) || isNaN(val))){
					if(id == this.channel.id){
						elemv = this.todToStr(val);
						bstyle = "pr_success";
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
				blink(this.hE, "pr_success", this.blink_tm);
				blink(this.mE, "pr_success", this.blink_tm);
				blink(this.sE, "pr_success", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElem(this.nvramE, d);
				break;
			case this.ACTION.GETR:
				this.updateElemR(this.ramE, d);
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
				blink(this.hE, "pr_failed", this.blink_tm);
				blink(this.mE, "pr_failed", this.blink_tm);
				blink(this.sE, "pr_failed", this.blink_tm);
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
	this.nvramE.onclick = function(){
		self.sendRequestGet();
	};
	this.ramE.onclick = function(){
		self.sendRequestGetr();
	};
	this.nowB.onclick = function(){
		self.pasteCurrentTime();
	};
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	var scont = cd();
	a(scont, [this.hE, this.mE, this.sE]);
	a(this.container, [this.descrE, this.nvramE, this.ramE, scont, this.nowB, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.nvramE, this.ramE],["pr_getelem"]);
	cla([scont],["pr_setcont"]);
	cla([this.hE, this.mE, this.sE],["pr_setelem2"]);
	cla([this.nowB, this.setB],["pr_button"]);
}
