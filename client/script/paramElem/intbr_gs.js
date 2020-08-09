function ParamElemBrGSInt(peer, cmd_get, cmd_set, min_v, max_v) {
	this.peer = peer;
	this.cmd_get = cmd_get;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.UNKNOWN_STR = "&empty;";
    this.nvramE = cd();
    this.nvramE.innerHTML = this.UNKNOWN_STR;
    this.setE = c("input");
    this.setE.type = "number";
    this.setE.min = min_v;
    this.setE.max = max_v;
    this.min_v = min_v;
    this.max_v = max_v;
    if(min_v < 0){
		this.setE.value = 0;
	}else{
		this.setE.value = min_v;
	}
    
    this.blink_tm = 200;
    this.ACTION =
		{
			GET: 1,
			GETR:2,
			SET: 3
		};
    this.updateStr = function (descr) {
		this.container.title = trans.get(359);
		this.descrE.innerHTML = descr;
		this.nvramE.title = trans.get(314);
		this.setE.title = trans.get(300);
		this.setB.updateStr(trans.get(304), trans.get(359));
	};
	this.sendRequestGet = function () {
		if(this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestI(this.cmd_get );
        var data = [
            {
                action: ['get_data'],
                param: {ipaddr: this.peer.ipaddr, port: this.peer.port, packs: pack, pack_count: 1}
            }
        ];
        cursor_blocker.enable();
        sendTo(this, data, this.ACTION.GET, 'server');
    };
    this.sendRequestSet = function (me) {
		if(me.peer.port === null || me.peer.ipaddr === null) return;
		var v = parseInt(me.setE.value);
		if(isNaN(v)){return;}
		if(v < me.min_v || v > me.max_v) return;
		var pack = acp_buildRequestII(me.cmd_set, v);
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: me.peer.ipaddr, port: me.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(me, data, me.ACTION.SET, 'server');
    };
    this.updateElem = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				var val = parseInt(data[0].v1);
				var status = parseInt(data[0].v2);
				if(!(isNaN(val))){
					if(status == 1){
						elemv = val;
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
    this.confirm = function (action, d, dt) {
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
	this.setB = new BtnProt(self, self.sendRequestSet, "pr_btnprot", true);
	this.nvramE.onclick = function(){
		self.sendRequestGet();
	};
	a(this.container, [this.descrE, this.nvramE, this.setE, this.setB]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.nvramE],["pr_getelem"]);
	cla([this.setE],["pr_setelem"]);
	cla([this.setB],["pr_button"]);
}
