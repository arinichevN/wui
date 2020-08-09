function TimerGroup(peer, channel) {
	this.container = new GroupElem();
	this.tod_on = new ParamElemGGSTime(peer, channel, CMD_.GET_TIMER_TIME_ON, CMD_.GETR_TIMER_TIME_ON, CMD_.SET_TIMER_TIME_ON);
	this.tod_off = new ParamElemGGSTime(peer, channel, CMD_.GET_TIMER_TIME_OFF, CMD_.GETR_TIMER_TIME_OFF, CMD_.SET_TIMER_TIME_OFF);
	this.interval_on = new ParamElemGGSInt(peer, channel, CMD_.GET_TIMER_INTERVAL_ON, CMD_.GETR_TIMER_INTERVAL_ON, CMD_.SET_TIMER_INTERVAL_ON, 0, INT32_MAX);
	this.interval_off = new ParamElemGGSInt(peer, channel, CMD_.GET_TIMER_INTERVAL_OFF, CMD_.GETR_TIMER_INTERVAL_OFF, CMD_.SET_TIMER_INTERVAL_OFF, 0, INT32_MAX);
	//this.output_on = new ParamElemGGSFloat(peer, channel, CMD_.GET_TIMER_OUTPUT_ON, CMD_.GETR_TIMER_OUTPUT_ON, CMD_.SET_TIMER_OUTPUT_ON, 0, INT32_MAX);
	//this.output_off = new ParamElemGGSFloat(peer, channel, CMD_.GET_TIMER_OUTPUT_OFF, CMD_.GETR_TIMER_OUTPUT_OFF, CMD_.SET_TIMER_OUTPUT_OFF, 0, INT32_MAX);
	this.updateStr = function () {
		this.container.updateStr(trans.get(387));
		this.tod_on.updateStr(trans.get(388)); 
		this.tod_off.updateStr(trans.get(389)); 
		this.interval_on.updateStr(trans.get(390)); 
		this.interval_off.updateStr(trans.get(391)); 
		//this.output_on.updateStr(trans.get(392)); 
		//this.output_off.updateStr(trans.get(393)); 
	};
	this.container.a([this.tod_on, this.tod_off, this.interval_on, this.interval_off]);
}
