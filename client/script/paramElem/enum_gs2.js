function ParamElemGSEnum2(peer, channel1, channel2, cmd_get, cmd_set, list) {
	this.channel1 = channel1;
	this.channel2 = channel2;
	this.peer = peer;
	this.cmd_get = cmd_get;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.UNKNOWN_STR = "&empty;";
    this.nvramE = new EnumElem(list, "pr_getelem");
    this.setE = new SelectElem(list, 1, "pr_setelem", null);
    this.setB = cb("");
    this.blink_tm = 200;
    this.ACTION =
		{
			GET: 1,
			SET: 3
		};
    this.updateStr = function (descr) {
		this.descrE.innerHTML = descr;
		this.nvramE.updateStr(trans.get(314));
		//this.setE.title = trans.get(300);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
	this.sendRequestGet = function () {
		if(this.channel1.id === null || this.channel2.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestIII(this.cmd_get, this.channel1.id, this.channel2.id );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, 'server');
    };
    this.sendRequestSet = function () {
		if(this.channel1.id === null || this.channel2.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var v = this.setE.getValue();
		if(v === null) return;
		var pack = acp_buildRequestIIII(this.cmd_set, this.channel1.id, this.channel2.id, v);
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.SET, 'server');
    };
    this.updateElem = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null, v3:null, v4:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var sid = parseInt(data[0].v2);
				var val = parseInt(data[0].v3);
				var status = parseInt(data[0].v4);
				if(!(isNaN(id) || isNaN(sid) || isNaN(val) || isNaN(status))){
					if(id == this.channel1.id){
						if(sid == this.channel2.id){
							if(status == 1){
								elemv = val;
								bstyle = "pr_success";
							}
						}
					}
				}
			}
		}
		elem.setValue(elemv);
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
				this.updateElem(this.nvramE, d);
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
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.nvramE.container.onclick = function(){
		self.sendRequestGet();
	};
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	a(this.container, [this.descrE, this.nvramE, this.setE, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.nvramE],["pr_getelem"]);
	cla([this.setE],["pr_setelem"]);
	cla([this.setB],["pr_button"]);
}
