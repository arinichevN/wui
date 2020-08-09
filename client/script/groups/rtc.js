function RTCGroup(peer, channel) {
	this.container = new GroupElem();
	this.date = new ParamElemGSDate(peer, channel, CMD_.GET_RTC_DATE, CMD_.SET_RTC_DATE);
	this.time = new ParamElemGSTime(peer, channel, CMD_.GET_RTC_TIME, CMD_.SET_RTC_TIME);
	this.updateStr = function () {
		this.container.updateStr(trans.get(386));
		this.date.updateStr(trans.get(384)); 
		this.time.updateStr(trans.get(385)); 
	};
	this.container.a([this.date, this.time]);
}
