function NoidCommandGetFts(master, command, precision){
	this.master = master;
	this.command = command;
	this.precision = precision;
	this.container = cd();
	this.container.innerHTML = UNKNOWN_STR;
	this.ACTION = {GET: 1};
	this.updateStr = function () {
		this.container.title = trans.getFrom(noid_command_dict, this.command);
	};
	this.updateValues = function(){
		this.sendRequest();
	};
	this.sendRequest = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, this.command, this.master.id]);
		remoteGetAcpData_bl(this, this.ACTION.GET, this.master.peer, d);
	};
	this.updateContent = function(v){
		let elemv = null;
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null, v2:null, v3:null, v4:null, v5:null});
			if(data instanceof Array && data.length == 1){
				let id = parseInt(data[0].v1);
				let val = parseFloat(data[0].v2);
				let ts = parseInt(data[0].v3);
				let tns = parseInt(data[0].v4);
				let success = parseInt(data[0].v5);
				if(!(isNaN(id) || isNaN(ts) || isNaN(tns) || isNaN(val) || !isFinite(val) || isNaN(success))){
					if(id == this.master.id){
						if(success == YES){
							elemv = val.toFixed(this.precision) + " " + ts + " " + tns + " " + success;
						}
					}
				}
			}
		}
		if(elemv !== null){
			updateStrElemGood(this.container, elemv);
		}else{
			updateStrElemBad(this.container);
		}
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.GET:
				this.updateContent(d);
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
				updateStrElemBad(this.container);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.container.onclick = ()=>{
		this.sendRequest();
	};
	cla(this.container, ["pr_getelem"]);
	this.updateStr();
}
