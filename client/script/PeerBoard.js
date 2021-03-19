function PeerBoard(){
	this.DEFAULT_PORT = 49188;
	this.DEFAULT_IPADDR = '127.0.0.1';
	this.port = null;
	this.ipaddr = null;
	this.container = cd();
	this.descrE = cd();
	this.ipaddrE = c("input");
	this.ipaddrE.type = "text";
	this.ipaddrE.value = this.DEFAULT_IPADDR;
	this.portE = c("input");
	this.portE.type = "number";
	this.portE.value = this.DEFAULT_PORT;
	this.updateStr = function () {
		this.descrE.innerHTML = trans.get(305);
		this.portE.title = trans.get(302);
		this.ipaddrE.title = trans.get(303);
	};
	this.updatePort = function(){
		this.port = getInt(this.portE.value);
	};
	this.updateIPaddr = function(){
		this.ipaddr = this.ipaddrE.value;
	};
	this.ipaddrE.onchange = ()=>{
		this.updateIPaddr();
	};
	this.portE.onchange = ()=>{
		this.updatePort();
	};
	this.updatePort();
	this.updateIPaddr();
	a(this.container, [this.descrE, this.ipaddrE, this.portE]);
	cla(this.descrE, ["gr_head", "tgr_head_descr"]);
	cla(this.ipaddrE, ["pr_setelem"]);
	cla(this.portE, ["pr_setelem"]);
	cla(this.container, ["pgr_cont"]);
}
