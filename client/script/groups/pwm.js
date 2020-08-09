function PWMGroup(peer, channel) {
	this.container = new GroupElem();
	this.resolution = new ParamElemGGSInt(peer, channel, CMD_.GET_PWM_RESOLUTION, CMD_.GETR_PWM_RESOLUTION, CMD_.SET_PWM_RESOLUTION, 0, INT32_MAX);
	this.period = new ParamElemGGSInt(peer, channel, CMD_.GET_PWM_PERIOD, CMD_.GETR_PWM_PERIOD, CMD_.SET_PWM_PERIOD, 0, INT32_MAX);
	this.dcmin = new ParamElemGGSInt(peer, channel, CMD_.GET_PWM_PW_MIN, CMD_.GETR_PWM_PW_MIN, CMD_.SET_PWM_PW_MIN, 0, INT32_MAX);
	this.dcmax = new ParamElemGGSInt(peer, channel, CMD_.GET_PWM_PW_MAX, CMD_.GETR_PWM_PW_MAX, CMD_.SET_PWM_PW_MAX, 0, INT32_MAX);
	this.updateStr = function () {
		this.container.updateStr(trans.get(350));
		this.resolution.updateStr(trans.get(351)); 
		this.period.updateStr(trans.get(375)); 
		this.dcmin.updateStr(trans.get(376)); 
		this.dcmax.updateStr(trans.get(377)); 
	};
	this.container.a([this.resolution, this.period, this.dcmin, this.dcmax]);
}
