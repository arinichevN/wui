function Noid(master, id, next_id){
	this.peer = master.peer;
	this.id = id;
	this.next_id = next_id;
	this.container = cd();
	this.descrE = cd();
	this.descrE.innerHTML = this.id;
	this.cmdCont = cd();
	this.shE = new ShowHideElement(null);
	this.commands = [];
	this.cmdd = new NoidCommandDetector([CMD_NOID_GET_EXISTS, CMD_NOID_GET_FTS, CMD_NOID_GET_STATE, CMD_NOID_GET_ERROR, CMD_NOID_GET_DEVICE_KIND, CMD_NOID_START, CMD_NOID_STOP, CMD_NOID_RESET, CMD_NOID_SET_GOAL, CMD_NOID_SET_TEXT, CMD_NOID_SET_TEXT_BLINK]);
	this.updateStr = function () {
		this.shE.updateStr();
		this.descrE.title = trans.get(304);
		for(let i = 0; i<this.commands.length; i++){
			this.commands[i].updateStr();
		}
	};
	this.checkCommands = function(is_last_command){
		clearc(this.cmdCont);
		cleara(this.commands);
		this.cmdd.checkCommands(this, this.peer, this.id, is_last_command);
	};
	this.onCheckCommandsFailed = function(){
		this.master.onCheckCommandsFailed();
	};
	this.onLastCommandChecked = function(){
		this.master.onLastCommandChecked();
	};
	this.updateValues = function(){
		for(let i=0; i<this.commands.length; i++){
			this.commands[i].updateValues();
		}
	};
	this.commandSupported = function(command){
		let new_item = null;
		switch(command){
			case CMD_NOID_GET_EXISTS:
				new_item = new NoidCommandGetEnum(this, command, yn_list);
				break;
			case CMD_NOID_GET_FTS:
				new_item = new NoidCommandGetFts(this, command, FLOAT_PRECISION);
				break;
			case CMD_NOID_GET_STATE:
				new_item = new NoidCommandGetEnum(this, command, state_list);
				break;
			case CMD_NOID_GET_ERROR:
				new_item = new NoidCommandGetEnum(this, command, error_list);
				break;
			case CMD_NOID_GET_DEVICE_KIND:
				new_item = new NoidCommandGetEnum(this, command, device_kind_list);
				break;
			case CMD_NOID_START:
			case CMD_NOID_STOP:
			case CMD_NOID_RESET:
				new_item = new NoidCommandCmd(this, command);
				break;
			case CMD_NOID_SET_GOAL:
				new_item = new NoidCommandSetFloat(this, command, FLOAT_MIN, FLOAT_MAX, FLOAT_PRECISION);
				break;
			case CMD_NOID_SET_TEXT:
			case CMD_NOID_SET_TEXT_BLINK:
				new_item = new NoidCommandSetStr(this, command);
				break;
		}
		this.commands.push(new_item);
		a(this.cmdCont, new_item);
	};
	this.descrE.onclick = ()=>{
		this.updateValues();
	};
	this.shE.setSlave(this.cmdCont);
	a(this.container, [this.shE, this.descrE, this.cmdCont]);
	cla(this.descrE, "no_item_descr");
	cla(this.cmdCont, "itemCont");
	cla(this.container, "aoid");
	this.updateStr();
}
