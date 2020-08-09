function ChannelGroup(peer, channel, yn_list, device_kind_list) {
	this.container = new GroupElem();
	this.start = new ParamElemSCmd(peer, channel, CMD_.CHANNEL_START, false);
	this.stop = new ParamElemSCmd(peer, channel, CMD_.CHANNEL_STOP, false);
	this.reload = new ParamElemSCmd(peer, channel, CMD_.CHANNEL_RELOAD, false);
	this.device_kind = new ParamElemGGSEnum(peer, channel, CMD_.GET_CHANNEL_DEVICE_KIND, CMD_.GETR_CHANNEL_DEVICE_KIND, CMD_.SET_CHANNEL_DEVICE_KIND, device_kind_list);
	this.pin = new ParamElemGGSInt(peer, channel, CMD_.GET_CHANNEL_PIN, CMD_.GETR_CHANNEL_PIN, CMD_.SET_CHANNEL_PIN, INT16_MIN, INT16_MAX);
	this.goal = new ParamElemGGSFloat(peer, channel, CMD_.GET_CHANNEL_GOAL, CMD_.GETR_CHANNEL_GOAL, CMD_.SET_CHANNEL_GOAL);
	this.save_goal = new ParamElemGGSEnum(peer, channel, CMD_.GET_CHANNEL_SAVE_GOAL, CMD_.GETR_CHANNEL_SAVE_GOAL, CMD_.SET_CHANNEL_SAVE_GOAL, yn_list);
	this.state = new ParamElemGStr(peer, channel, CMD_.GETR_CHANNEL_STATE);
	this.err = new ParamElemGStr(peer, channel, CMD_.GETR_CHANNEL_ERROR);
	this.gfts = new ParamElemGFTS(peer, channel, CMD_.GET_CHANNEL_FTS);
	this.updateStr = function () {
		this.container.updateStr(trans.get(317));
		this.start.updateStr(trans.get(309), null);
		this.stop.updateStr(trans.get(310), null); 
		this.reload.updateStr(trans.get(311), null); 
		this.device_kind.updateStr(trans.get(374)); 
		this.pin.updateStr(trans.get(394)); 
		this.goal.updateStr(trans.get(322)); 
		this.save_goal.updateStr(trans.get(360)); 
		this.state.updateStr(trans.get(320)); 
		this.err.updateStr(trans.get(319)); 
		this.gfts.updateStr(trans.get(318));
	};
	this.container.a([this.start, this.stop, this.reload, this.device_kind, this.pin, this.goal, this.save_goal, this.state, this.err, this.gfts]);
}
