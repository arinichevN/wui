function AoidUnknown (master, id, parent_id, kind, description_id) {
	this.master = master;
	this.id = id;
	this.parent_id = parent_id;
	this.description_id = description_id;
	this.kind = kind;
	this.container = cd();
	this.descrE = cd();
	this.updateStr = function () {
		this.descrE.innerHTML = trans.get(316);
	};
	this.checkCommands = function(){
		;
	};
	this.getData = function(storage){
		storage.push({id: this.id, parent_id: this.parent_id, kind: this.kind, description_id: this.description_id, commands:[]});
	};
	this.updateValues = function(){
		;
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
		console.warn("this aoid is not able to store children", c);
	};
	a(this.container, [this.descrE]);
	cla(this.descrE, "ao_bad_descr");
	cla(this.container, "aoid");
	this.updateStr();
}
