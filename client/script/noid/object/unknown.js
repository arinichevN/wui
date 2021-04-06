
function NoidUnknown(master, id, next_id){
	this.master = master;
	this.id = id;
	this.next_id = next_id;
	this.container = cd();
	this.descrE = cd();
	this.updateStr = function(){
		this.descrE.innerHTML = trans.get(316);
	};
	this.checkCommands = function(is_last_command){
		;
	};
	this.onCheckCommandsFailed = function(){
		this.master.onCheckCommandsFailed();
	};
	this.onLastCommandChecked = function(){
		this.master.onLastCommandChecked();
	};
	this.updateValues = function(){
		;
	};
	a(this.container, [this.descrE]);
	cla(this.descrE, "ao_bad_descr");
	cla(this.container, "aoid");
	this.updateStr();
}
