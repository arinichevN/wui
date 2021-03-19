function NoidTreeList(peer){
	this.peer = peer;
	this.items = [];
	this.container = cd();
	this.itemCont = cd();
	this.descrE = cd();
	this.getB = cb();
	this.shE = new ShowHideElement(null);
	this.updateStr = function () {
		this.descrE.innerHTML = trans.get(309);
		this.getB.innerHTML = trans.get(80);
		this.shE.updateStr();
		for(let i = 0; i<this.items.length; i++){
			this.items[i].updateStr();
		}
	};
	this.createNewItem = function(){
		let new_item = new NoidTree(this, this.peer);
		this.items.push(new_item);
		a(this.itemCont, new_item);
		//new_item.refresh();
	};
	this.deleteItem = function(item){
		this.items = delari(this.items, item);
		this.itemCont.removeChild(item.container);
	};
	this.getB.onclick = ()=>{
		this.createNewItem();
	};
	let hcont = cd();
	let bcont = cd();
	this.shE.setSlave([bcont, this.itemCont]);
	a(hcont, [this.shE, this.descrE]);
	a(bcont, [this.getB]);
	a(this.container, [hcont, bcont, this.itemCont]);
	cla(hcont, "at_line");
	cla(bcont, "at_line");
	cla(this.getB, "pr_button");
	cla(this.descrE, "ngr_head_descr");
	cla(this.itemCont, "itemCont");
	cla(this.container, "ngr_cont");
} 
