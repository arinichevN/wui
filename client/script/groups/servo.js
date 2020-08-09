function ServoGroup(peer, channel) {
	this.container = new GroupElem();
	this.pw_min = new ParamElemGGSInt(peer, channel, CMD_.GET_SERVO_PW_MIN, CMD_.GETR_SERVO_PW_MIN, CMD_.SET_SERVO_PW_MIN, 0, INT32_MAX);
	this.pw_max = new ParamElemGGSInt(peer, channel, CMD_.GET_SERVO_PW_MAX, CMD_.GETR_SERVO_PW_MAX, CMD_.SET_SERVO_PW_MAX, 0, INT32_MAX);
	this.in_min = new ParamElemGGSFloat(peer, channel, CMD_.GET_SERVO_IN_MIN, CMD_.GETR_SERVO_IN_MIN, CMD_.SET_SERVO_IN_MIN);
	this.in_max = new ParamElemGGSFloat(peer, channel, CMD_.GET_SERVO_IN_MAX, CMD_.GETR_SERVO_IN_MAX, CMD_.SET_SERVO_IN_MAX);
	this.updateStr = function () {
		this.container.updateStr(trans.get(365));
		this.pw_min.updateStr(trans.get(361));
		this.pw_max.updateStr(trans.get(362));
		this.in_min.updateStr(trans.get(363));
		this.in_max.updateStr(trans.get(364));
	};
	this.container.a([this.pw_min, this.pw_max, this.in_min, this.in_max]);
}
