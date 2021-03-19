function ShowHideElement(slave) {
	this.slave = slave;
	this.container = cd();
	this.container.innerHTML = "[sh]";
	this.container.title = "";
	this.show = ()=>{;}
	this.hide = ()=>{;}
	this.isHidden = ()=>{return 1;}
	this.updateStr = function (v) {
		this.container.title = trans.get(this.title_id);
	};
	this.setSlave = function(slave){
		this.slave = slave;
		this.setFunctions();
		this.hide();
	};
	this.setFunctions = function(){
		if(isElements(this.slave)){
			this.show = this.showf;
			this.hide = this.hidef;
			this.isHidden = this.isHiddenf;
		}else{
			this.container.innerHTML = "[sh]";
			this.title_id = -1;
			this.container.title = trans.get(this.title_id);
			this.show = ()=>{;}
			this.hide = ()=>{;}
			this.isHidden = ()=>{return 1;}
		}
	};
	this.showf = function(){
		clr(this.slave, "hdn");
		this.container.innerHTML = "[-]";
		this.title_id = 79;
		this.container.title = trans.get(this.title_id);
	};
	this.hidef = function(){
		cla(this.slave, "hdn");
		this.container.innerHTML = "[+]";
		this.title_id = 78;
		this.container.title = trans.get(this.title_id);
	};
	this.isHiddenf = function(){
		if(clc(this.slave, "hdn")){
			return 1;
		}
		return 0;
	};
	this.showHide = function(){
		if(this.isHidden()){
			this.show();
		}else{
			this.hide();
		}
	};
	this.setFunctions();
	this.container.onclick = ()=>{
		this.showHide();
	};
	cla(this.container, ["gr_sh"]);
	this.showHide();
}
