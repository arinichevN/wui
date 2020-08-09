function AppGroup(peer, channel, sdev_list, srate_list, sconfig_list, skind_list, senable_list) {
	this.container = new GroupElem();
	this.new_id = new ParamElemBrGSInt(peer, CMD_.GET_APP_ID, CMD_.SET_APP_ID, INT16_MIN, INT16_MAX);
	this.fchannel = new ParamElemGSInt(peer, channel, CMD_.GET_APP_CHANNEL_ID_FIRST, CMD_.SET_APP_CHANNEL_ID_FIRST, INT16_MIN, INT16_MAX);
	this.channel_add = new ParamElemSInt(peer, channel, CMD_.APP_CHANNEL_ADD, INT16_MIN, INT16_MAX);
	this.channel_del = new ParamElemSInt(peer, channel, CMD_.APP_CHANNEL_DELETE, INT16_MIN, INT16_MAX);
	this.step_add = new ParamElemSInt(peer, channel, CMD_.APP_STEP_ADD, INT16_MIN, INT16_MAX);
	this.step_del = new ParamElemSInt(peer, channel, CMD_.APP_STEP_DELETE, INT16_MIN, INT16_MAX);
	this.state = new ParamElemGStr(peer, channel, CMD_.GET_APP_STATE);
	this.err = new ParamElemGStr(peer, channel, CMD_.GET_APP_ERROR);
	this.serial = new SerialGroup(peer, channel, sdev_list, srate_list, sconfig_list, skind_list, senable_list);
	
	this.updateStr = function () {
		this.container.updateStr(trans.get(334));
		this.new_id.updateStr(trans.get(302));
		this.fchannel.updateStr(trans.get(337));
		this.channel_add.updateStr(trans.get(366));
		this.channel_del.updateStr(trans.get(367));
		this.step_add.updateStr(trans.get(368));
		this.step_del.updateStr(trans.get(369));
		this.state.updateStr(trans.get(320));
		this.err.updateStr(trans.get(319));
		this.serial.updateStr(trans.get(330));
	};
	this.container.a([this.new_id, this.fchannel, this.channel_add, this.channel_del, this.step_add, this.step_del, this.state, this.err, this.serial]);
}
