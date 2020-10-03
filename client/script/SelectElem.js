function SelectElem(descr_id, items, sz, style, vpt){
	this.descr_id = descr_id;
	this.vpt = vpt;
	this.container = c("select");
	s(this.container, "size", sz);
	this.items = items;
	this.value = null;
    
    this.updateStr = function () {
		this.container.title = trans.get(this.descr_id);
    };
    for(var i=0;i<items.length;i++){
		var o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=items[i].name;
		a(this.container, o);
	}
	this.setValue = function(v){
		for(var i=0;i<this.items.length;i++){
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
    var self = this;
    this.container.onchange = function(){
		self.valChanged();
	};
	this.container.selectedIndex = 0;
	this.valChanged();
}
