function ParamElemCheckCommands(peer, channel, slave) {
	this.channel = channel;
	this.slave = slave;

	this.container = cd();
	this.checkB = cb();
	this.cmdd = new CommandDetector(peer, []);
    this.updateStr = function () {
		this.checkB.innerHTML = trans.get(417);
	};
	this.check = function(){
		this.slave.checkCommands(this.channel);
	};
	var self = this;
    this.checkB.onclick = function(){
		self.check();
	};
	a(this.container, [this.checkB]);
	cla(this.container, ["pr"]);
	cla([this.checkB],["pr_button"]);
}
