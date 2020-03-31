function SelectElemChb(items, sz, style, slave){
	this.container = cd();
	this.slave = slave;
	this.valE = c("select");	
	s(this.valE, "size", sz);
	this.items = items;
	this.selE = c("input");
    this.selE.type = "checkbox";
	this.value = null;
    this.selected = false;
    
    this.updateStr = function (v) {
		this.container.title = v;
    };
    for(var i=0;i<items.length;i++){
		var o = c("option");
		if(i===0){
			o.selected = true;	
		}
		o.innerHTML=items[i].name;
		a(this.valE, o);
	}
	this.setValue = function(v){
		for(var i=0;i<this.items.length;i++){
			if(this.items[i].value === v){
				this.valE.selectedIndex = i;
			}
		}
	};
	this.getValue = function(){
		return this.items[this.valE.selectedIndex].value;
	};
    this.selChanged = function () {
		if(this.selE.checked){
			this.selected = true;
		}else{
			this.selected = false;
		}
		if(this.slave){
			this.slave.elemSelectinChanged();
		}
    };
    this.valChanged = function () {
		this.value = this.getValue();
    };
    a(this.container, [this.valE, this.selE]);
    cla(this.valE, ["ine_val"]);
    cla(this.selE, ["ine_sel"]);
    cla(this.container, ["ine_cont", style]);
    var self = this;
    this.valE.onchange = function(){
		self.valChanged();
	};
	this.selE.onchange = function(){
		self.selChanged();
	};
	this.valE.selectedIndex = 0;
	this.valChanged();
}
