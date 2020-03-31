function EnumElem(items, style){
	this.container = cd();
	this.items = items;
	
	this.UNKNOWN_STR = "&empty;";
	this.value = null;
	this.container.innerHTML = this.UNKNOWN_STR;
    this.updateStr = function (v) {
		this.container.title = v;
    };
	this.setValue = function(v){
		for(var i=0;i<this.items.length;i++){
			if(this.items[i].value === v){
				this.container.innerHTML = this.items[i].name;
				this.value = v;
				return;
			}
		}
		this.value = null;
		this.container.innerHTML = this.UNKNOWN_STR;
	};
	this.getValue = function(){
		return this.value;
	};
    cla(this.container, [style]);
}
