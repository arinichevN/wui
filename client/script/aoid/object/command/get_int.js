function AoidCommandGetInt(master, command){
	this.master = master;
	this.command = command;
	this.container = cd();
	this.container.innerHTML = UNKNOWN_STR;
	this.value = null;
	this.ACTION = {GET: 1};
	this.updateStr = function () {
		this.container.title = trans.getFrom(aoid_command_dict, this.command);
	};
	this.getData = function(){
		return {name: this.command, content:this.value}; 
	};
	this.updateValues = function(){
		this.sendRequest();
	};
	this.setValues = function(data){
		return false;
	};
	this.sendRequest = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, this.command, this.master.master.app_id, this.master.id]);
		remoteGetAcpData_bl(this, this.ACTION.GET, this.master.master.peer, d);
	};
	this.updateContent = function(v){
		let elemv = null;
		if(v !== null){
			let data = acp_parseResponse(v, {v1:null, v2:null, v3:null, v4:null});
			if(data instanceof Array && data.length == 1){
				let app_id = parseInt(data[0].v1);
				let id = parseInt(data[0].v2);
				let val = parseInt(data[0].v3);
				let success = parseInt(data[0].v4);
				if(!(isNaN(app_id) || isNaN(id) || isNaN(val) || isNaN(success))){
					if(app_id == this.master.master.app_id && id == this.master.id){
						if(success == YES){
							elemv = val;
						}
					}
				}
			}
		}
		this.value = elemv;
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
