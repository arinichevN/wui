function SecureGroup(peer, channel, yn_list) {
	this.container = new GroupElem();
	this.enable = new ParamElemGGSEnum(peer, channel, CMD_GET_SEC_ENABLE, CMD_GETR_SEC_ENABLE, CMD_SET_SEC_ENABLE, yn_list);
	this.tm = new ParamElemGGSInt(peer, channel, CMD_GET_SEC_TM, CMD_GETR_SEC_TM, CMD_SET_SEC_TM, 0, INT32_MAX);
	this.output = new ParamElemGGSFloat(peer, channel, CMD_GET_SEC_OUT, CMD_GETR_SEC_OUT, CMD_SET_SEC_OUT, 0, INT32_MAX);
	this.state = new ParamElemGStr(peer, channel, CMD_GETR_SEC_STATE);
	this.updateStr = function () {
		this.container.updateStr(trans.get(340));
		this.enable.updateStr(trans.get(321)); 
		this.tm.updateStr(trans.get(338)); 
		this.output.updateStr(trans.get(339)); 
		this.state.updateStr(trans.get(320)); 
	};
	this.container.a([this.enable, this.tm, this.output, this.state]);
}
