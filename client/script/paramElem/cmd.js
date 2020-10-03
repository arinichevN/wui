function ParamElemSCmd(peer, channel, descr_id, title_id, cmd, protect) {
	this.channel = channel;
	this.peer = peer;
	this.descr_id = descr_id;
	this.title_id = title_id;
	this.cmd = cmd;
	this.container = cd();
	
    this.blink_tm = 200;
    this.ACTION =
		{
			SET: 1
		};
    this.updateStr = function () {
		this.setB.updateStr(trans.get(this.descr_id), trans.get(this.title_id));
	};
	this.sendRequest = function (me) {
		if(me.channel.id === null || me.peer.port === null || me.peer.ipaddr === null) return;
		var pack = acp_buildRequestII(ACPP_SIGN_REQUEST_SET, me.cmd, me.channel.id );
        var data = [
            {
                action: ['set_data'],
                param: {ipaddr: me.peer.ipaddr, port: me.peer.port, packs: pack}
            }
        ];
        cursor_blocker.enable();
        sendTo(me, data, me.ACTION.SET, 'server');
    };
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.SET:
				blink(this.setB, "pr_success", this.blink_tm);
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
				blink(this.setB, "pr_failed", this.blink_tm);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	var self = this;
    this.setB = new BtnProt(self, self.sendRequest, "pr_btnprot", protect);
    this.cmdd = new CommandDetector(peer, [{elem: this.setB, commands: [this.cmd]}]);
	a(this.container, [this.setB]);
	cla(this.container, ["pr"]);
	cla([this.setB],["pr_button"]);
}
