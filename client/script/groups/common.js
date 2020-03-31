function CommonGroup(peer, channel, yn_list) {
	this.container = new GroupElem();
	this.exists = new ParamElemGEnum(peer, channel, CMD_GET_ID_EXISTS, yn_list);
	this.updateStr = function () {
		this.container.updateStr(trans.get(358));
		this.exists.updateStr(trans.get(323));
	};
	this.container.a([this.exists]);
}
