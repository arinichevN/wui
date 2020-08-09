function ParamElemSInt(peer, channel, cmd_set, min_v, max_v) {
	this.channel = channel;
	this.peer = peer;
	this.cmd_set = cmd_set;
	this.container = cd();
    this.descrE = cd();
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
    this.blink_tm = 200;
    this.ACTION =
		{
			SET: 3
		};
    this.updateStr = function (descr) {
		this.descrE.innerHTML = descr;
		this.setE.title = trans.get(300);
		this.setB.innerHTML = trans.get(304);
		this.setB.title = trans.get(306);
	};
    this.sendRequestSet = function () {
		if(this.channel.id === null || this.peer.port === null || this.peer.ipaddr === null) return;
		var v = parseInt(this.setE.value);
		if(isNaN(v)){return;}
		if(v < this.min_v || v > this.max_v) return;
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
    this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blink(this.setE, "pr_success", this.blink_tm);
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
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.setB.onclick = function(){
		self.sendRequestSet();
	};
	a(this.container, [this.descrE, this.setE, this.setB]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.setE],["pr_setelem"]);
	cla([this.setB],["pr_button"]);
}
