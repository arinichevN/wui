function AoidParamDateD(master, id, parent_id, kind, description_id) {
	this.master = master;
	this.id = id;
	this.parent_id = parent_id;
	this.kind = kind;
	this.description_id = description_id;
	this.commands = [];
	this.container = cd();
	this.cmdCont = cd();
	this.descrE = cd();
	this.cmdd = new AoidCommandDetector([CMD_AOID_GET_RAM_VALUE, CMD_AOID_GET_NVRAM_VALUE, CMD_AOID_SET_NVRAM_VALUE]);
	this.updateStr = function () {
		this.descrE.innerHTML = trans.getFrom(aoid_description_dict, this.description_id);
		this.descrE.title = trans.get(318);
		for(let i=0;i<this.commands.length; i++){
			this.commands[i].updateStr();
		}
	};
	this.checkCommands = function(){
		clearc(this.cmdCont);
		cleara(this.commands);
		this.cmdd.checkCommands(this, this.master.peer, this.master.app_id, this.id);
	};
	this.getData = function(storage){
		let cmds = [];
		for(let i=0;i<this.commands.length; i++){
			cmds.push(this.commands[i].getData());
		}
		storage.push({id: this.id, parent_id: this.parent_id, kind: this.kind, description_id: this.description_id, commands:cmds});
	};
	this.updateValues = function(){
		for(let i=0;i<this.commands.length; i++){
			this.commands[i].updateValues();
		}
	};
	this.setValues = function(data){
		if(data.id === this.id){
			if(data.parent_id === this.parent_id && data.kind === this.kind && data.description_id === this.description_id){
				for(let i=0; i<data.commands.length; i++){
					for(let j=0; j<this.commands.length; j++){
						if(this.commands[j].setValues(data.commands[i])){
							break;
						}
					}
				}
			}else{
				console.warn("bad data: ", data);
			}
			return true;
		}
		return false;
	};
	this.a = function(c){
		console.warn("this aoid is not able to store children", this, c);
	};
	this.commandSupported = function(command){
		let new_item = null;
		switch(command){
			case CMD_AOID_GET_RAM_VALUE:
			case CMD_AOID_GET_NVRAM_VALUE:
				new_item = new AoidCommandGetDateD(this, command);
				break;
			case CMD_AOID_SET_NVRAM_VALUE:
				new_item = new AoidCommandSetDateD(this, command);
				break;
		}
		this.commands.push(new_item);
		a(this.cmdCont, new_item);
	};
	this.descrE.onclick = ()=>{
		this.updateValues();
	};
	a(this.container, [this.descrE, this.cmdCont]);
	cla(this.descrE, ["ao_param_descr"]);
	cla(this.cmdCont, "a_cmdCont");
	cla(this.container, "aoid");
	this.updateStr();
}
