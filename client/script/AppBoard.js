function AppBoard(peer){
	this.peer = peer;
	this.DEFAULT_APP_ID = 10;
	this.id = this.DEFAULT_APP_ID;
	this.container = cd();
	this.descrE = cd();
	this.idE = c("input");
	this.idE.type = "number";
	this.idE.value = this.id;
	this.getIdB = cb();
	this.blink_tm = 200;
	this.aoids_raw = [];
	this.ACTION ={GET: 1};
	this.updateStr = function () {
		this.descrE.innerHTML = trans.get(301);
		this.idE.title = trans.get(304);
		this.getIdB.innerHTML = trans.get(306);
		this.getIdB.title = trans.get(333);
	};
	this.updateId = function(){
		this.id = getInt(this.idE.value);
	};
	
	this.getIdB.onclick = () => {
		this.getAppId();
	}
	this.idE.onchange = () => {
		this.updateId();
	};
	this.getAppId = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_APP_GET_ID, NOID_ID_BROADCAST]);
		remoteGetAcpData_bl(this, this.ACTION.GET, this.peer, d);
	};
	
	this.updateElem = function(elem, v){
		let elemv = 0;
		let bstyle = "pr_failed";
		let found = 0;
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null});
			if(data instanceof Array && data.length == 1){
				let val = parseInt(data[0].v1);
				if(!(isNaN(val))){
						found = 1;
						elemv = val;
						bstyle = "pr_success";
				}
			}
		}
		if(found){
			elem.value = elemv;
			this.updateId();
		}
		blink(elem, bstyle, this.blink_tm);
	};
	this.updateElemBad = function(elem){
		blink(elem, "pr_failed", this.blink_tm);
	};
	this.confirm = function (action, data, dt) {
		switch (action) {
			case this.ACTION.GET:
				this.updateElem(this.idE, data);
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
				this.updateElemBad(this.idE);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	a(this.container, [this.descrE, this.idE, this.getIdB]);
	cla(this.descrE, ["gr_head", "tgr_head_descr"]);
	cla(this.idE, ["pr_setelem"]);
	cla([this.getIdB], "pr_button");
	cla(this.container, ["agr_cont"]);
}
