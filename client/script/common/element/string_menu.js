function StringMenuNode(master, raw_node){
	this.master = master;
	this.name_id = raw_node.name_id;//also this ID
	this.description_id = raw_node.description_id;
	this.func = raw_node.func;
	this.container = cd();
	this.descrE = cd();
	this.downE = cd();
	this.updateStr = function(){
		this.descrE.innerHTML = trans.get(this.name_id);
		this.descrE.title = trans.get(this.description_id);
		this.downE.title = trans.get(320);
	};
	this.act = function(){
		if(this.func !== null){
			this.func();
		}
	};
	this.goDown = function(){
		if(this.children.length){
			this.showChildren();
			this.master.setUpperNode(this);
		}
	};
	this.hideChildren = function(){
		for(let i=0; i<this.children.length; i++){
			this.children[i].hide();
		}
	};
	this.showChildren = function(){
		for(let i=0; i<this.children.length; i++){
			this.children[i].show();
		}
	};
	this.hide = function(){
		cla(this.container, "hdn");
	};
	this.show = function(){
		clr(this.container, "hdn");
	}
	this.descrE.onclick = ()=>{
		this.act();
	}
	this.downE.onclick = ()=>{
		this.goDown();
	}
	a(this.container, [this.descrE, this.downE]);
	
}

function StringMenu([{id: 12, func: null}, nodes:[{id: 12, func:null, nodes:[]}]}, {id: 12, func:null, nodes:[]}]){
	this.nodes = null;
	this.cnode = null;
	this.unode = null;
	this.container = cd();
	this.itemCont = cd();
	this.upE = cd();
	this.updateStr = function(){
		this.updateNodeStr(this.nodes);
	};
	this.updateNodeStr = function(node){
		if(node === null) return;
		if(node instanceof Array){
			for(let i=0; i<node.length; i++){
				this.updateNodeStr(node[i]);
			}
		}else{
			node.updateStr();
		}
	};
	this.getNodeByPath = function(path_arr, ind, cnode){
		if(ind < path_arr.length){
			let id = path_arr[ind];
			if(cnode instanceof Array){
				for(let i=0;i<cnode.length;i++){
					if(cnode[i].name_id === id){
						ind++;
						return this.getNodeByPath(path_arr, ind, cnode[i]);
					}
				}
			}else{
				if(cnode.name_id === id){
					ind++;
					return this.getNodeByPath(path_arr, ind, cnode);
				}
			}
			return null;
		} else {
			return cnode;
		}
	};
	this.addRawNode = function(raw_node){
		if(raw_node instanceof Array){
			for(let i=0;i<raw_node.length;i++){
				this.addRawNode(raw_node[i]);
			}
		}else{
			let nnode = new StringMenuNode(this, raw_node);
			a(this.itemCont, nnode);
		}
	};
	this.addRawNode = function(path_to_parent_arr, raw_node){
		var parent = this.getNodeByPath(path_to_parent_arr, 0, this.nodes);
		if(parent !== null){
			parent.addRawNode(raw_node);
		}
	};
	this.setCurrentNode = function(node){
		this.cnode = node;
	};
	this.setUpperNode = function(node){
		this.unode = node;
	};
	this.goUp = function(){
		this.unode.hideChildren();
		this.unode = this.unode.parent;
		this.unode.showChildren();
	}
	a(this.container, [this.upE, this.itemCont]);
}
