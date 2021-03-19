function AoidCommandGetArrInt(master, command, length){
	this.master = master;
	this.command = command;
	this.length = length;
	this.container = cd();
	this.container.innerHTML = UNKNOWN_STR;
	this.value = [];
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
		this.value = [];
		if(v !== null){
			var farr = [null, null, null];
			for(let i=0; i<this.length; i++){
				farr.push(null);
			}
			farr.push(null);
			let data = acp_parseResponseArr(v, farr);
			if(data instanceof Array && data.length == 1){
				let app_id = parseInt(data[0][0]);
				let id = parseInt(data[0][1]);
				let varr = [];
				let val_bad = false;
				for(let i=0; i<this.length; i++){
					let v = parseInt(data[0][i + 2]);
					if(isNaN(v)){
						val_bad = true;
						break;
					}
					varr.push(v);
				}
				let success = parseInt(data[0][this.length + 2]);
				if(!(isNaN(app_id) || isNaN(id) || val_bad || isNaN(success))){
					if(app_id == this.master.master.app_id && id == this.master.id){
						if(success == YES){
							this.value = varr;
							elemv = "";
							for(let i=0; i<this.length; i++){
								if(i == 0){
									elemv = elemv + varr[i];
								}else{
									elemv = elemv + ":" + varr[i];
								}
								
							}
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
