function AoidTree(master, peer, app_id) {
	this.master = master;
	this.peer = {ipaddr:peer.ipaddr, port:peer.port};
	this.app_id = app_id;
	this.items = [];
	this.raw_items = [];
	this.container = cd();
	this.itemCont = cd();
	this.shE = new ShowHideElement(null);
	this.idE = cd();
	this.idE.innerHTML = this.app_id;
	this.portE = cd();
	this.portE.innerHTML = this.peer.port;
	this.ipaddrE = cd();
	this.ipaddrE.innerHTML = this.peer.ipaddr;
	this.updateB = cb();
	this.uploadB = cb();
	this.downloadB = cb();
	this.deleteB = cb();
	this.ACTION = {GET_FIRST: 2, GET_NEXT: 3};
	this.updateStr = function () {
		this.idE.title = trans.get(332);
		this.ipaddrE.title = trans.get(303);
		this.portE.title = trans.get(302);
		this.shE.updateStr();
		this.updateB.innerHTML = trans.get(46);
		this.uploadB.innerHTML = trans.get(1);
		this.downloadB.innerHTML = trans.get(311);
		this.downloadB.title = trans.get(312);
		this.deleteB.innerHTML = trans.get(51);
		for(let i = 0; i<this.items.length; i++){
			this.items[i].updateStr();
		}
	};
	this.getData = function(storage){
		for(let i=0; i<this.items.length; i++){
			this.items[i].getData(storage);
		}
	};
	this.setValues = function(data){
		for(let i=0; i<data.length; i++){
			for(let j=0; j<this.items.length; j++){
				if(this.items[j].setValues(data[i])){
					break;
				}
			}
		}
	};
	this.checkFileData = function(data){
		if(typeof data !== "object"){
			console.warn("bad file data: ", data);
			return 0;
		}
		if(!data instanceof Array){
			console.warn("bad file data (not array): ", data);
			return 0;
		}
		for(let i=0; i<data.length; i++){
			let o = data[i];
			if(typeof o.id !== "number"){
				console.warn("bad object.id: ", o);
				return 0;
			}
			if(typeof o.parent_id !== "number"){
				console.warn("bad object.parent_id: ", o);
				return 0;
			}
			if(typeof o.kind !== "number"){
				console.warn("bad object.kind: ", o);
				return 0;
			}
			if(typeof o.description_id !== "number"){
				console.warn("bad object.description_id: ", o);
				return 0;
			}
			if(typeof o.commands !== "object"){
				console.warn("bad object.commands: ", o);
				return 0;
			}
			if(!o.commands instanceof Array){
			console.warn("bad file data (not array): ", o.commands);
			return 0;
		}
			for(let j=0; j<o.commands.length; j++){
				let cmd = o.commands[j];
				if(typeof cmd.name !== "number"){
					console.warn("bad command.content: ", cmd);
					return 0;
				}
				if(typeof cmd.content === "undefined"){
					console.warn("bad command.content: ", cmd);
					return 0;
				}
			}
		}
		return 1;
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
		let parent_id = raw_item.parent_id;
		let kind = raw_item.kind;
		let description_id = raw_item.description_id;
		//console.log("aoid", id, trans.getFrom(aoid_description_dict, description_id));
		switch(kind){
			case AOID_KIND_UNKNOWN:
				new_item = new AoidUnknown(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_COMPLEX:
				new_item = new AoidComplex(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_LIST:
				new_item = new AoidList(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_SERIAL_ID_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, serial_device_list);
				break;
			case AOID_KIND_SERIAL_RATE_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, serial_rate_list);
				break;
			case AOID_KIND_SERIAL_DPS_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, serial_dps_list);
				break;
			case AOID_KIND_SERIAL_MODE_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, serial_mode_list);
				break;
			case AOID_KIND_DEVICE_KIND_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, device_kind_list);
				break;
			case AOID_KIND_YN_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, yn_list);
				break;
			case AOID_KIND_PIN_STATE_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, pin_state_list);
				break;
			case AOID_KIND_PIN_MODE_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, pin_mode_list);
				break;
			case AOID_KIND_INT8_PARAM:
			case AOID_KIND_INT16_PARAM:
			case AOID_KIND_INT32_PARAM:
			case AOID_KIND_UINT8_PARAM:
			case AOID_KIND_UINT16_PARAM:
			case AOID_KIND_UINT32_PARAM:
				new_item = new AoidParamInt(this, id, parent_id, kind, description_id, aoidGetIntMin(kind), aoidGetIntMax(kind));
				break;
			case AOID_KIND_FLOAT_PARAM:
				new_item = new AoidParamFloat(this, id, parent_id, kind, description_id, FLOAT_MIN, FLOAT_MAX, FLOAT_PRECISION);
				break;
			case AOID_KIND_STR_PARAM:
				//new_item = new AoidParamStr(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_TIMEMS_PARAM:
			case AOID_KIND_TIMEUS_PARAM:
			case AOID_KIND_TIMES_PARAM:
				new_item = new AoidParamInt(this, id, parent_id, kind, description_id, aoidGetIntMin(kind), aoidGetIntMax(kind));
				break;
			case AOID_KIND_TODS_PARAM:
				new_item = new AoidParamTodS(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_DATED_PARAM:
				new_item = new AoidParamDateD(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_TIMES_PARAM:
				new_item = new AoidParamInt(this, id, parent_id, kind, description_id, aoidGetIntMin(kind), aoidGetIntMax(kind));
				break;
			case AOID_KIND_DS18B20_RESOLUTION_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, ds18b20_resolution_list);
				break;
			case AOID_KIND_DS18B20_ADDRESS_PARAM:
				new_item = new AoidParamArrInt(this, id, parent_id, kind, description_id, 8, 0, 255);
				break;
			case AOID_KIND_COMMAND:
				new_item = new AoidCommand(this, id, parent_id, kind, description_id);
				break;
			case AOID_KIND_NOID_COMMAND_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, indicator_acp_command_list);
				break;
			case AOID_KIND_AIND_MODE_PARAM:
				new_item = new AoidParamEnum(this, id, parent_id, kind, description_id, aind_channel_mode_list);
				break;
			default:
				new_item = new AoidUnsupported (this, id, parent_id, kind, description_id);
				break;
		}
		return new_item;
	};
	this.createItems = function(){
		for(let i=0; i<this.raw_items.length; i++){
			let new_item = this.createItem(this.raw_items[i]);
			if(new_item !== null){
				this.items.push(new_item);
			}
		}
	};
	this.buildHierarchy = function(){
		for(let i = 0; i<this.items.length; i++){
			let item = this.items[i];
			a(this.itemCont, item);
		}
		for(let i = 0; i<this.items.length; i++){
			let item = this.items[i];
			let parent = this.getElementById(item.parent_id);
			if(parent !== null){
				parent.a(item);
			}
		}
	};
	this.checkCommands = function(){
		for(let i = 0; i<this.items.length; i++){
			let item = this.items[i];
			item.checkCommands();
		}
	};
	this.buildItems = function(){
		this.createItems();
		this.buildHierarchy();
		this.checkCommands();
	};
	this.refresh = function(){
		clearc(this.itemCont);
		cleara(this.items);
		cleara(this.raw_items);
		this.getFirstItem();
	};
	this.download = function(){
		let input = c("input");
		input.type = "file";
		input.onchange = (e) => {
			let file = e.target.files[0]; 
			let reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = (readerEvent) => {
				let content = readerEvent.target.result;
				let file_data = null;
				try {
					file_data = JSON.parse(content);
				} catch (e) {
					blinkElemBad(this.downloadB);
					return;
				}
				if(this.checkFileData(file_data)){
					this.setValues(file_data);
				}else{
					blinkElemBad(this.downloadB);
				}
				
			}
		}
		input.click();
	};
	
	this.upload = function(){
		let data = [];
		this.getData(data);
		let dstr = JSON.stringify(data);
		let blob = new Blob([dstr], {type: "text/plain"});
		let file_name = "parameters_" + this.app_id + ".txt";
		let linkE = c("a");
		linkE.download = file_name;
		linkE.href = window.URL.createObjectURL(blob);
		linkE.style.display = "none";
		a(document.body, linkE);
		linkE.click(); 
	};
	this.getFirstItem = function () {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_AOID_GET_FIRST, this.app_id]);
		remoteGetAcpData_bl(this, this.ACTION.GET_FIRST, this.peer, d);
	};
	this.getNextItem = function (oid_id) {
		let d = acp_buildRequest([ACPP_SIGN_REQUEST_GET, CMD_AOID_GET_NEXT, this.app_id, oid_id]);
		remoteGetAcpData_bl(this, this.ACTION.GET_NEXT, this.peer, d);
	};
	this.addItem = function(v){
		let found = 0;
		if(v !== null){
			if(v instanceof String) {
				blinkElemBad(this.updateB);
				this.buildItems();
				return;
			}
			if(v.length === 0){
				blinkElemBad(this.updateB);
				this.buildItems();
				return;
			}
			//app_id, oid_id, oid_parent_id, oid_kind, oid_description
			let data = acp_parseResponse(v, {v1:null, v2:null, v3:null, v4:null, v5:null});
			if(data instanceof Array && data.length == 1){
				let app_id = parseInt(data[0].v1);
				let oid_id = parseInt(data[0].v2);
				let oid_parent_id = parseInt(data[0].v3);
				let oid_kind = parseInt(data[0].v4);
				let oid_descr = parseInt(data[0].v5);
				if(!(isNaN(app_id) || isNaN(oid_id) || isNaN(oid_parent_id) || isNaN(oid_kind) || isNaN(oid_descr))){
					if(app_id === this.app_id){
						found = 1;
						//console.log("aoid new raw");
						if(oid_id == AOID_ID_UNKNOWN){//no more objects
							//console.log("aoid: building");
							this.buildItems();
							return;
						}else{
							//console.log("aoid: next");
							this.raw_items.push({id: oid_id, parent_id: oid_parent_id, kind: oid_kind, description_id: oid_descr});
							this.getNextItem(oid_id);
						}
					}else{
						console.warn("bad app_id:", app_id, " expected:", this.app_id);
					}
				}
			}
		}
		if(!found){
			this.addItemFailed();
		}
	};
	this.addItemFailed = function(){
		this.raw_items.push({id: AOID_ID_UNKNOWN, parent_id: AOID_ID_UNKNOWN, kind: AOID_KIND_UNKNOWN, descr: AOID_DESCRIPTION_UNKNOWN});
		this.buildItems();
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
				blinkElemBad(this.updateB);
				cursor_blocker.disable();
				break;
			case this.ACTION.GET_FIRST:
				blinkElemBad(this.updateB);
				cursor_blocker.disable();
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
	this.uploadB.onclick = ()=>{
		this.upload();
	};
	this.downloadB.onclick = ()=>{
		this.download();
	};
	this.deleteB.onclick = ()=>{
		this.master.deleteItem(this);
	};
	let hcont = cd();
	let bcont = cd();
	this.shE.setSlave([bcont, this.itemCont]);
	a(hcont, [this.shE, this.idE, this.ipaddrE, this.portE]);
	a(bcont, [this.updateB, this.uploadB, this.downloadB, this.deleteB]);
	a(this.container, [hcont, bcont, this.itemCont]);
	cla(hcont, "at_line");
	cla(bcont, "at_line");
	cla(this.idE, "at_head_descr");
	cla([this.ipaddrE, this.portE], "at_peer");
	cla([this.updateB, this.uploadB, this.downloadB, this.deleteB], "pr_button");
	
	cla(this.itemCont, "itemCont");
	cla(this.container, "at_cont");
	this.updateStr();
}
