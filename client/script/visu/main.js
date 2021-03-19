function Monitor() {
	this.type = VISU_TYPE.MAIN;
	this.container = null;
	this.lang = null;
	this.peer = null;
	this.app = null;
	this.aoid_list = null;
	this.noid_list = null;
	this.init = function () {
		this.container = cvis();
		this.lang = new LanguageSelector(trans);
		this.peer = new PeerBoard();
		this.app = new AppBoard(this.peer);
		this.aoid_list = new AoidTreeList(this.peer, this.app);
		this.noid_list = new NoidTreeList(this.peer);
		a(this.container, [this.lang, this.peer, this.app, this.aoid_list, this.noid_list]);
		this.initialized = true;
	};
	this.getName = function () {
		return trans.get(401);
	};
	this.updateStr = function () {
		this.peer.updateStr();
		this.app.updateStr();
		this.aoid_list.updateStr();
		this.noid_list.updateStr();
    };
    this.show = function () {
		document.title = trans.get(1001);
		clr(this.container, "hdn");
		this.visible = true;
    };
    this.hide = function () {
		cla(this.container, "hdn");
		this.visible = false;
    };
}
let vmonitor = new Monitor();
visu.push(vmonitor);
