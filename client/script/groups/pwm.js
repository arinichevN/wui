function PWMGroup(peer, channel) {
	this.container = new GroupElem();
	this.resolution = new ParamElemGGSInt(peer, channel, CMD_GET_PWM_RESOLUTION, CMD_GETR_PWM_RESOLUTION, CMD_SET_PWM_RESOLUTION, 0, INT32_MAX);
	this.period = new ParamElemGGSInt(peer, channel, CMD_GET_PWM_PERIOD, CMD_GETR_PWM_PERIOD, CMD_SET_PWM_PERIOD, 0, INT32_MAX);
	this.dcmin = new ParamElemGGSInt(peer, channel, CMD_GET_PWM_PW_MIN, CMD_GETR_PWM_PW_MIN, CMD_SET_PWM_PW_MIN, 0, INT32_MAX);
	this.dcmax = new ParamElemGGSInt(peer, channel, CMD_GET_PWM_PW_MAX, CMD_GETR_PWM_PW_MAX, CMD_SET_PWM_PW_MAX, 0, INT32_MAX);
	this.updateStr = function () {
		this.container.updateStr(trans.get(350));
		this.resolution.updateStr(trans.get(351)); 
		this.period.updateStr(trans.get(352)); 
		this.dcmin.updateStr(trans.get(361)); 
		this.dcmax.updateStr(trans.get(362)); 
	};
	this.container.a([this.resolution, this.period, this.dcmin, this.dcmax]);
}
