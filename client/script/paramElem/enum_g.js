function ParamElemGEnum(peer, channel, descr_id, cmd_get, list) {
	this.peer = peer;
	this.channel = channel;
	this.descr_id = descr_id;
	this.cmd_get = cmd_get;
	this.container = cd();
    this.descrE = cd();
	this.UNKNOWN_STR = "&empty;";
    this.valE = new EnumElem(list, "pr_idelem");
    this.blink_tm = 200;
   
    this.cmdd = new CommandDetector(peer, [{elem: this.valE, commands: [this.cmd_get]}]);
    
    this.ACTION =
		{
			GET: 1,
			CHECK_CMD: 5
		};
    this.updateStr = function () {
		this.descrE.innerHTML = trans.get(this.descr_id);
		this.valE.updateStr(trans.get(313));
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
    this.updateElem = function(elem, v){
		var elemv = null;
		var bstyle = "pr_failed";
		if(v !== null){
			var data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				var id = parseInt(data[0].v1);
				var val = parseInt(data[0].v2);
				if(!(isNaN(id) || isNaN(val))){
					if(id == this.channel.id){
						elemv = val;
						bstyle = "pr_success";
					}
				}
			}
		}
		elem.setValue(elemv);
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
	this.valE.container.onclick = function(){
		self.sendRequestGet();
	};
	a(this.container, [this.descrE, this.valE]);
	cla(this.container, ["pr"]);
	cla(this.descrE, ["pr_descr"]);
	cla([this.valE],["pr_getelem"]);
}
