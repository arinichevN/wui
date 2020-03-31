function ParamElemGFTS(peer, channel, cmd_get) {
	this.channel = channel;
	this.peer = peer;
	this.cmd_get = cmd_get;
	this.container = cd();
    this.descrE = cd();
    this.valE = cd();
	this.UNKNOWN_STR = "&empty;";
    this.valE.innerHTML = this.UNKNOWN_STR;
    this.blink_tm = 200;
    this.precision = 3;
    this.delimiter = "\t";
    this.tm = {tv_sec:null, tv_nsec:null};
    this.ACTION =
		{
			GET: 1
		};
    this.updateStr = function (descr) {
		this.descrE.innerHTML = descr;
		this.valE.title = trans.get(313);
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
    this.updateElem = function(elem, v){
		var elemv = this.UNKNOWN_STR;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parsePack(v, {id:null, value:null, tv_sec:null, tv_nsec:null, state:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].id);
				var val = parseFloat(data[0].value);
				var tv_sec = parseInt(data[0].tv_sec);
				var tv_nsec = parseInt(data[0].tv_nsec);
				var state = parseInt(data[0].state);
				if(!(isNaN(id) || isNaN(val) || !isFinite(val) || isNaN(tv_sec) || isNaN(tv_nsec) || isNaN(state))){
					elemv = id + this.delimiter + val + this.delimiter + tv_sec + this.delimiter + tv_nsec + this.delimiter + state;
					bstyle = "pr_success";
				}
			}
		}
		elem.innerHTML = elemv;
		blink(elem, bstyle, this.blink_tm);
	};
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.GET:
				this.updateElem(this.valE, d);
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
         }
         cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.GET:
				this.updateElem(this.valE, null);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
	this.valE.onclick = function(){
		self.sendRequestGet();
	};
	a(this.container, [this.descrE, this.valE]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([ this.valE],["pr_getelem"]);
}
