function RegGroup(peer, channel, method_list, mode_list) {
	this.container = new GroupElem();
	this.method = new ParamElemGGSEnum(peer, channel, CMD_.GET_REG_METHOD, CMD_.GETR_REG_METHOD, CMD_.SET_REG_METHOD, method_list);
	this.pidc = new GroupElem();
	this.pid_mode = new ParamElemGGSEnum(peer, channel, CMD_.GET_PID_MODE, CMD_.GETR_PID_MODE, CMD_.SET_PID_MODE, mode_list);
	this.pid_kp = new ParamElemGGSFloat(peer, channel, CMD_.GET_PID_KP, CMD_.GETR_PID_KP, CMD_.SET_PID_KP, 0, INT32_MAX);
	this.pid_ki = new ParamElemGGSFloat(peer, channel, CMD_.GET_PID_KI, CMD_.GETR_PID_KI, CMD_.SET_PID_KI, 0, INT32_MAX);
	this.pid_kd = new ParamElemGGSFloat(peer, channel, CMD_.GET_PID_KD, CMD_.GETR_PID_KD, CMD_.SET_PID_KD, 0, INT32_MAX);
	this.pid_out_min = new ParamElemGGSFloat(peer, channel, CMD_.GET_PID_OUT_MIN, CMD_.GETR_PID_OUT_MIN, CMD_.SET_PID_OUT_MIN, 0, INT32_MAX);
	this.pid_out_max = new ParamElemGGSFloat(peer, channel, CMD_.GET_PID_OUT_MAX, CMD_.GETR_PID_OUT_MAX, CMD_.SET_PID_OUT_MAX, 0, INT32_MAX);
	this.pos2c = new GroupElem();
	this.pos2_mode = new ParamElemGGSEnum(peer, channel, CMD_.GET_POS2_MODE, CMD_.GETR_POS2_MODE, CMD_.SET_POS2_MODE, mode_list);
	this.pos2_hys = new ParamElemGGSFloat(peer, channel, CMD_.GET_POS2_HYS, CMD_.GETR_POS2_HYS, CMD_.SET_POS2_HYS, 0, INT32_MAX);
	this.pos2_omin = new ParamElemGGSInt(peer, channel, CMD_.GET_POS2_OUT_MIN, CMD_.GETR_POS2_OUT_MIN, CMD_.SET_POS2_OUT_MIN, 0, INT32_MAX);
	this.pos2_omax = new ParamElemGGSInt(peer, channel, CMD_.GET_POS2_OUT_MAX, CMD_.GETR_POS2_OUT_MAX, CMD_.SET_POS2_OUT_MAX, 0, INT32_MAX);
	this.updateStr = function () {
		this.container.updateStr(trans.get(345));
		this.method.updateStr(trans.get(346)); 
		this.pidc.updateStr(trans.get(356));
		this.pid_mode.updateStr(trans.get(347)); 
		this.pid_kp.updateStr("Kp"); 
		this.pid_ki.updateStr("Ki"); 
		this.pid_kd.updateStr("Kd");
		this.pid_out_min.updateStr(trans.get(372));
		this.pid_out_max.updateStr(trans.get(373));
		this.pos2c.updateStr(trans.get(357));
		this.pos2_mode.updateStr(trans.get(347));
		this.pos2_hys.updateStr(trans.get(355));
		this.pos2_omin.updateStr(trans.get(348));
		this.pos2_omax.updateStr(trans.get(349));
	};
	this.pidc.a([this.pid_mode, this.pid_kp, this.pid_ki, this.pid_kd, this.pid_out_min, this.pid_out_max]);
	this.pos2c.a([this.pos2_mode, this.pos2_hys, this.pos2_omin, this.pos2_omax]);
	this.container.a([this.method, this.pidc, this.pos2c]);
}
