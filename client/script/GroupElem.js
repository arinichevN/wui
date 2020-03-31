function GroupElem() {
    this.container = cd();
    this.headerE = cd();
    this.itemCont = cd();
	this.shE = cd();
	this.shE.innerHTML = "+";
	this.shE.title = trans.get();
    this.updateStr = function (v) {
		this.headerE.innerHTML = v;
    };
    this.a = function(v){
		a(this.itemCont, v);
	};
	this.showHide = function(){
		if(clc(this.itemCont, "hdn")){
			clr(this.itemCont, "hdn");
			this.shE.innerHTML = "[-]";
			this.shE.title = trans.get(370);
		}else{
			cla(this.itemCont, "hdn");
			this.shE.innerHTML = "[+]";
			this.shE.title = trans.get(371);
		}
	};
	var self = this;
	this.shE.onclick = function(){
		self.showHide();
	};
	var hcont = cd();
	a(hcont, [this.headerE, this.shE]);
    a(this.container, [hcont, this.itemCont]);
    cla(this.headerE, ["gr_head"]);
    cla(this.shE, ["gr_sh"]);
    cla(hcont, ["gr_hcont"]);
    cla(this.itemCont, ["gr_itemCont"]);
    cla(this.container, ["gr"]);
    this.showHide();
}
