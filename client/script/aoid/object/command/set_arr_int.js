function AoidCommandSetArrInt(master, command, length, minv, maxv){
	this.master = master;
	this.command = command;
	this.ACTION = {SET: 1};
	this.container = cd();
	this.setB = cb();
	this.setC = cd();
	this.length = length;
	this.minv = minv;
	this.maxv = maxv;
	this.setElements = [];
	for(let i=0; i<this.length; i++){
		let setE = c("input");
		setE.type = "number";
		setE.min = minv;
		setE.max = maxv;
		setE.value = minv;
		this.setElements.push(setE);
	}
	this.updateStr = function () {
		this.setC.title = trans.get(300);
		this.setB.innerHTML = trans.get(314);
		this.setB.title = trans.getFrom(aoid_command_dict, this.command);
	};
	this.getData = function(){
		return {name: this.command, content:null}; 
	};
	this.updateValues = function(){
		;
	};
	this.setValues = function(data){
		switch(this.command){
			case CMD_AOID_SET_NVRAM_VALUE:
				if(data.name == CMD_AOID_GET_NVRAM_VALUE){
					if(data.content !== null){
						if(data.content instanceof Array){
							if(data.content.length == this.length){
								for(let i = 0; i<this.length; i++){
									this.setElements[i].value = data.content[i];
								}
							}
						}
						
					}
					return true;
				}
				break;
			case CMD_AOID_SET_RAM_VALUE:
				if(data.name == CMD_AOID_GET_RAM_VALUE){
					if(data.content !== null){
						if(data.content instanceof Array){
							if(data.content.length == this.length){
								for(let i = 0; i<this.length; i++){
									this.setElements[i].value = data.content[i];
								}
							}
						}
						
					}
					return true;
				}
				break;
		}
		return false;
	};
	this.sendRequestSet = function () {
		let rarr = [ACPP_SIGN_REQUEST_SET, this.command, this.master.master.app_id, this.master.id];
		for(let i = 0; i<this.length; i++){
			let v = parseInt(this.setElements[i].value);
			if(isNaN(v)){return;}
			if(v < this.minv || v > this.maxv) return;
			rarr.push(v);
		}
		let d = acp_buildRequest(rarr);
		remoteSetAcpData_bl(this, this.ACTION.SET, this.master.master.peer, d);
	};
	this.confirm = function (action, d, dt) {
		switch (action) {
			case this.ACTION.SET:
				blinkElemGood(this.setC);
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
				blinkElemBad(this.setC);
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.setB.onclick = ()=>{
		this.sendRequestSet();
	};
	a(this.setC, this.setElements);
	a(this.container, [this.setC, this.setB]);
	cla(this.setElements, "pr_setelem");
	cla(this.setB, "pr_button");
	cla([this.container, this.setC], "at_line");
	this.updateStr();
}
