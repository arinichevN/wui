function ParamElemGSInt(peer, channel, descr_id, cmd_get, cmd_set, min_v, max_v) {
	this.peer = peer;
	this.channel = channel;
	this.descr_id = descr_id;
	this.cmd_get = cmd_get;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
    this.UNKNOWN_STR = "&empty;";
    this.getE = cd();
    this.getE.innerHTML = this.UNKNOWN_STR;
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
    this.setB = cb("");
    this.cmdd = new CommandDetector(peer, [
	    {elem: this.getE, commands: [this.cmd_get]},
	    {elem: this.setB, commands: [this.cmd_set]}
    ]);
    this.blink_tm = 200;
    this.ACTION =
		{
			GET: 1,
			SET: 3,
			CHECK_CMD: 5
		};
    this.updateStr = function () {
		this.descrE.innerHTML = trans.get(this.descr_id);
		this.getE.title = trans.get(335);
		this.setE.title = trans.get(300);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
	this.sendRequestGet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_GET, this.cmd_get, this.channel.id );
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
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var v = parseInt(this.setE.value);
		if(isNaN(v)){return;}
		if(v < this.min_v || v > this.max_v) return;
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
    this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blink(this.setE, "pr_success", this.blink_tm);
				break;
			case this.ACTION.GET:
				this.updateElem(this.getE, d);
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
				this.updateElem(this.getE, null);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.getE.onclick = function(){
		self.sendRequestGet();
	};
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	a(this.container, [this.descrE, this.getE, this.setE, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.getE],["pr_getelem"]);
	cla([this.setE],["pr_setelem"]);
	cla([this.setB],["pr_button"]);
}
