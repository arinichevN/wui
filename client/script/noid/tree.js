function NoidTree(master, peer){
	this.master = master;
	this.peer = {ipaddr: peer.ipaddr, port: peer.port};
	this.items = [];
	this.raw_items = [];
	this.command_failed = false;
	this.container = cd();
	this.itemCont = cd();
	this.shE = new ShowHideElement(null);
	this.descrE = cd();
	this.portE = cd();
	this.portE.innerHTML = this.peer.port;
	this.ipaddrE = cd();
	this.ipaddrE.innerHTML = this.peer.ipaddr;
	this.updateB = cb();
	this.deleteB = cb();
	this.ACTION ={GET_FIRST: 2,	GET_NEXT: 3};
	this.updateStr = function () {
		this.descrE.innerHTML = trans.get(331);
		this.ipaddrE.title = trans.get(303);
		this.portE.title = trans.get(302);
		this.updateB.innerHTML = trans.get(46);
		this.deleteB.innerHTML = trans.get(51);
		this.shE.updateStr();
		for(let i = 0; i<this.items.length; i++){
			this.items[i].updateStr();
		}
	};
	this.updateValues = function(){
		for(let i=0; i<this.items.length; i++){
			this.items[i].updateValues();
		}
	};
	this.getElementById = function(id){
		for(let i = 0; i<this.items.length; i++){
			let item = this.items[i];
			if(item.id === id){
				return item;
			}
		}
		return null;
	};
	this.createItem = function (raw_item){
		let new_item = null;
		let id = raw_item.id;
		let next_id = raw_item.next_id;
		if(id !== NOID_ID_UNKNOWN){
			new_item = new Noid(this, id, next_id);
		}else{
			new_item = new NoidUnknown(this, id, next_id);
		}
		return new_item;
	};
	this.createItems = function(){
		for(let i=0; i<this.raw_items.length; i++){
			let new_item = this.createItem(this.raw_items[i]);
			if(new_item !== null){
				this.items.push(new_item);
			} else {
				console.warn("unknown NOID");
			}
		}
	};
	this.buildElements = function(){
		for(let i = 0; i<this.items.length; i++){
			let item = this.items[i];
			a(this.itemCont, item);
		}
	};
	this.checkCommands = function(){
		for(let i = 0; i<this.items.length; i++){
			this.items[i].checkCommands(i===(this.items.length-1));
		}
	};
	this.buildItems = function(){
		this.createItems();
		this.buildElements();
		this.checkCommands();
	};
	this.refresh = function(){
		clearc(this.itemCont);
		cleara(this.items);
		cleara(this.raw_items);
		this.command_failed = false;
		this.getFirstItem();
	};
	this.refreshFailed = function(){
		clearc(this.itemCont);
		cleara(this.items);
		cleara(this.raw_items);
		blinkElemBad(this.updateB);
	};
	this.onCheckCommandsFailed = function(){
		this.command_failed = true;
	};
	this.onLastCommandChecked = function(){
		//console.log("last NOID command checked");
		if(this.command_failed){
			this.refreshFailed();
		}
	};
	this.getFirstItem = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET_BROADCAST, CMD_NOID_GET_FIRST]);
		remoteGetAcpData_bl(this, this.ACTION.GET_FIRST, this.peer, d);
	};
	this.getNextItem = function (oid_id) {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET_BROADCAST, CMD_NOID_GET_NEXT, oid_id]);
		remoteGetAcpData_bl(this, this.ACTION.GET_NEXT, this.peer, d);
	};
	this.addItem = function(v){
		if(v !== null){
			if(v instanceof String) {
				this.refreshFailed();
				console.warn("is string");
				return;
			}
			if(v.length === 0){
				this.refreshFailed();
				console.warn("no rows");
				return;
			}
			//oid_id, oid_parent_id, oid_kind, oid_description
			let data = acp_parseResponse(v, {v1:null, v2:null});
			if(data instanceof Array && data.length == 1){
				let oid_id = parseInt(data[0].v1);
				let next_oid_id = parseInt(data[0].v2);
				if(!(isNaN(oid_id) || isNaN(next_oid_id))){
					this.raw_items.push({id: oid_id, next_id: next_oid_id});
					if(next_oid_id == NOID_ID_UNKNOWN){//no more objects
						this.buildItems();
						return;
					}else{
						this.getNextItem(next_oid_id);
					}
				} else {
					this.refreshFailed();
					console.warn("bad response format");
				}
			} else {
				this.refreshFailed();
				console.warn("bad data");
			}
		}
	};
	this.confirm = function (action, data, dt) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				this.addItem(data);
				break;
			case this.ACTION.GET_FIRST:
				this.addItem(data);
				break;
			default:
				console.warn("confirm: unknown action: ", action);
				break;
		 }
		 cursor_blocker.disable();
	};
	this.abort = function (action, data, ind, dt, user) {
		switch (action) {
			case this.ACTION.GET_NEXT:
				this.refreshFailed();
				cursor_blocker.disable();
				console.warn("get next: abort");
				break;
			case this.ACTION.GET_FIRST:
				this.refreshFailed();
				cursor_blocker.disable();
				console.warn("get first: abort");
				break;
			default:
				console.warn("abort: unknown action: ", action);
				break;
		}
		cursor_blocker.disable();
	};
	this.updateB.onclick = ()=>{
		this.refresh();
	};
	this.deleteB.onclick = ()=>{
		this.master.deleteItem(this);
	};
	this.descrE.onclick = ()=>{
		this.updateValues();
	};
	let hcont = cd();
	let bcont = cd();
	this.shE.setSlave([bcont, this.itemCont]);
	a(hcont, [this.shE, this.descrE, this.ipaddrE, this.portE]);
	a(bcont, [this.updateB, this.deleteB]);
	a(this.container, [hcont, bcont, this.itemCont]);
	cla(hcont, "at_line");
	cla(bcont, "at_line");
	cla(this.descrE, "no_tree_descr");
	cla([this.ipaddrE, this.portE], "at_peer");
	cla([this.updateB, this.deleteB], "pr_button");
	cla(this.itemCont, "itemCont");
	cla(this.container, "nt_cont");
	this.updateStr();
}
