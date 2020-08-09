function ParamElemGSDate(peer, channel, cmd_get, cmd_set) {
	this.channel = channel;
	this.peer = peer;
	this.cmd_get = cmd_get;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.DAYS_IN_YEAR = 403
	this.DAYS_IN_MONTH = 31;
    this.UNKNOWN_STR = "&empty;";
    this.nvramE = cd();
    this.nvramE.innerHTML = this.UNKNOWN_STR;
    
    this.yE = c("input");
    this.yE.type = "number";
    this.yE.step = 1;
    this.yE.value = 2000;
    
    this.mE = c("input");
    this.mE.type = "number";
    this.mE.step = 1;
    this.mE.value = 1;
    
    this.dE = c("input");
    this.dE.type = "number";
    this.dE.step = 1;
    this.dE.value = 1;
    
    this.setB = cb("");
    this.nowB = cb("");
    
    this.blink_tm = 200;

    this.ACTION =
		{
			GET: 1,
			SET: 2
		};
    this.updateStr = function (descr) {
		this.descrE.innerHTML = descr;
		this.nvramE.title = trans.get(314);
		this.yE.title = trans.get(378);
		this.mE.title = trans.get(379);
		this.dE.title = trans.get(380);
		this.nowB.innerHTML = trans.get(397);
		this.nowB.title = trans.get(398);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
	this.sendRequestGet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(this.cmd_get, this.channel.id );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, 'server');
    };
    this.getMaxDaysInMonth = function(y, m){
		switch(m){
			case 1: return 31;
			case 2: if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) return 29; else return 28;
			case 3: return 31;
			case 4: return 30;
			case 5: return 31;
			case 6: return 30;
			case 7: return 31;
			case 8: return 31;
			case 9: return 30;
			case 10: return 31;
			case 11: return 30;
			case 12: return 31;
		}
	};
	this.pasteCurrentDate = function(){
		var dt = new Date();
		this.yE.value = dt.getFullYear();
		this.mE.value = dt.getMonth() + 1;
		this.dE.value = dt.getDate();
	};
    this.sendRequestSet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var y = parseInt(this.yE.value);
		var m = parseInt(this.mE.value);
		var d = parseInt(this.dE.value);
		var good_param = true;
		if(isNaN(y) || y < 2000 || y > 2099) {console.warn("bad year"); this.updateElemBad(this.yE); good_param = false;}
		if(isNaN(m) || m < 1 || m > 12) {console.warn("bad month"); this.updateElemBad(this.mE); good_param = false;}
		if(isNaN(d) || d < 1 || d > this.getMaxDaysInMonth(y, m)) {console.warn("bad day"); this.updateElemBad(this.dE); good_param = false;}
		if(!good_param) return;
		var v = this.DAYS_IN_YEAR * (y-2000) + this.DAYS_IN_MONTH * m + d;
		var pack = acp_buildRequestIII(this.cmd_set, this.channel.id, v);
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SET, 'server');
    };
	this.updateElemNVRAM = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseInt(data[0].v2);
				var status = parseInt(data[0].v3);
				if(!(isNaN(id) || isNaN(val) || !isFinite(val) || isNaN(status))){
					if(id == this.channel.id){
						if(status == 1){
							var y = val / this.DAYS_IN_YEAR;
							var m = (val % this.DAYS_IN_YEAR) / this.DAYS_IN_MONTH;
							var d = val % this.DAYS_IN_MONTH;
							elemv = intTo2str(Math.floor(y)) + "-" + intTo2str(Math.floor(m)) + "-" + intTo2str(d);
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
				blink(this.yE, "pr_success", this.blink_tm);
				blink(this.mE, "pr_success", this.blink_tm);
				blink(this.dE, "pr_success", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElemNVRAM(this.nvramE, d);
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
				blink(this.yE, "pr_failed", this.blink_tm);
				blink(this.mE, "pr_failed", this.blink_tm);
				blink(this.dE, "pr_failed", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElemBad(this.nvramE);
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
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	this.nowB.onclick = function(){
		self.pasteCurrentDate();
	};
	var scont = cd();
	a(scont, [this.yE, this.mE, this.dE]);
	a(this.container, [this.descrE, this.nvramE, scont, this.nowB, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.nvramE],["pr_getelem"]);
	cla([scont],["pr_setcont"]);
	cla([this.yE],["pr_setelem4"]);
	cla([this.mE, this.dE],["pr_setelem2"]);
	cla([this.nowB, this.setB],["pr_button"]);
}
