function SelectElement(items, sz, style, vpt){
	this.vpt = vpt;
	this.container = c("select");
	s(this.container, "size", sz);
	this.items = items;
	this.value = null;
    
    this.updateStr = function (v) {
		this.container.title = trans.get(v);
    };
    for(let i=0;i<items.length;i++){
		let o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=items[i].name;
		a(this.container, o);
	}
	this.setValue = function(v){
		for(let i=0;i<this.items.length;i++){
			if(this.items[i].value === v){
				this.container.selectedIndex = i;
			}
		}
	};
	this.getValue = function(){
		return this.items[this.container.selectedIndex].value;
	};
    this.valChanged = function () {
		this.value = this.getValue();
		if(this.vpt!==null){
			this.vpt.id = this.getValue();
		}
    };
    cla(this.container, [style]);
    this.container.onchange = ()=>{
		this.valChanged();
	};
	this.container.selectedIndex = 0;
	this.valChanged();
}
