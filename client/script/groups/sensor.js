function SensorGroup(peer, channel, sdev_list) {
	this.container = new GroupElem();
	this.id = new ParamElemGGSInt(peer, channel, CMD_.GET_RSENSOR_ID, CMD_.GETR_RSENSOR_ID, CMD_.SET_RSENSOR_ID, INT16_MIN, INT16_MAX);
	this.interval = new ParamElemGGSInt(peer, channel, CMD_.GET_RSENSOR_INTERVAL, CMD_.GETR_RSENSOR_INTERVAL, CMD_.SET_RSENSOR_INTERVAL, 0, INT32_MAX);
	this.serial = new ParamElemGGSEnum(peer, channel, CMD_.GET_RSENSOR_SERIAL, CMD_.GETR_RSENSOR_SERIAL, CMD_.SET_RSENSOR_SERIAL, sdev_list);
	this.state = new ParamElemGStr(peer, channel, CMD_.GETR_RSENSOR_STATE);
	this.err = new ParamElemGStr(peer, channel, CMD_.GETR_RSENSOR_ERROR);
	this.updateStr = function () {
		this.container.updateStr(trans.get(344));
		this.id.updateStr(trans.get(302)); 
		this.interval.updateStr(trans.get(342)); 
		this.serial.updateStr(trans.get(343)); 
		this.state.updateStr(trans.get(320)); 
		this.err.updateStr(trans.get(319)); 
	};
	this.container.a([this.id, this.interval, this.serial, this.state, this.err]);
}
