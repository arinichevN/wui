function AoidCommand (master, id, parent_id, kind, description_id){
	this.master = master;
	this.id = id;
	this.parent_id = parent_id;
	this.kind = kind;
	this.description_id = description_id;
	this.commands = [];
	this.items = [];
	this.container = cd();
	this.itemCont = cd();
	this.descrE = cd();
	this.cmdCont = cd();
	this.cmdd = new AoidCommandDetector([CMD_AOID_START, CMD_AOID_STOP, CMD_AOID_RESET, CMD_AOID_SET_RAM_VALUE, CMD_AOID_SET_NVRAM_VALUE, CMD_AOID_GET_RAM_VALUE, CMD_AOID_GET_NVRAM_VALUE]);
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
		for(let i=0;i<this.items.length; i++){
			this.items[i].updateValues();
		}
	};
	this.setValues = function(data){
		if(data.id === this.id){
			if(!(data.parent_id === this.parent_id && data.kind === this.kind && data.description_id === this.description_id)){
				console.warn("bad data: ", data);
			}
			return true;
		}
		return false;
	};
	this.a = function(c){
		this.items.push(c);
		a(this.itemCont, c);
	};
	this.commandSupported = function(command){
		let new_item = new AoidCommandCmd(this, command);
		this.commands.push(new_item);
		a(this.cmdCont, new_item);
	};
	this.descrE.onclick = ()=>{
		this.updateValues();
	};
	a(this.container, [this.descrE, this.cmdCont, this.itemCont]);
	cla(this.descrE, "ao_complex_descr");
	cla(this.cmdCont, "a_cmdCont");
	cla(this.itemCont, "itemCont");
	cla(this.container, "aoid");
	this.updateStr();
}
