function Monitor() {
    this.type = VISU_TYPE.MAIN;
    this.container = {};
    this.DEFAULT_PORT = 49188;
    this.DEFAULT_IPADDR = '127.0.0.1';
    this.DEFAULT_CHANNEL_ID = 21;
    this.DEFAULT_APP_ID = 20;
    this.initialized = false;
    this.update = true; //editor will make it false
    this.visible = false;
    this.peer = {port:null, ipaddr:null};
    this.channel = {id:null, elem: null};
    this.app = {id:null, elem:null};
    this.port = null;
    this.ipaddrE = null;
    this.portE = null;
    this.textE = null;
    this.showaB = null;
	this.elements = [];
    this.init = function () {
		this.container = cvis();
		this.ipaddrE = c("input");
	    this.ipaddrE.type = "text";
	    this.ipaddrE.value = this.DEFAULT_IPADDR;
	    this.portE = c("input");
	    this.portE.type = "number";
	    this.portE.value = this.DEFAULT_PORT;
	    this.channel.elem = c("input");
	    this.channel.elem.type = "number";
	    this.channel.elem.value = this.DEFAULT_CHANNEL_ID;
	    this.app.elem = c("input");
	    this.app.elem.type = "number";
	    this.app.elem.value = this.DEFAULT_APP_ID;
	    this.textE = c('pre');
	    this.showaB = cb();
	    var self = this;
		this.portE.onchange = function(){
			self.updatePort();
		};
		this.ipaddrE.onchange = function(){
			self.updateIPaddr();
		};
		this.channel.elem.onchange = function(){
			self.updateChannel();
		};
		this.app.elem.onchange = function(){
			self.updateApp();
		};
		this.showaB.onclick = function(){
			self.showAllElements();
		};
		var pcont = cd();
		var peer = this.peer;
		var channel = this.channel;
		var lapp = this.app;
		this.elements = [
			new MainGroup(334, [
				new ParamElemBrGSInt(peer, 302, CMD_.GET_APP_ID, CMD_.SET_APP_ID, INT16_MIN, INT16_MAX, lapp),
				//new ParamElemCheckCommands(peer, lapp, this),
				new ParamElemGetSupportedCommands(peer, lapp, this),
				new ParamElemGChannels(peer, lapp, channel),
				new ParamElemSCmd(peer, lapp, 418, null, CMD_.APP_RESET, false),
				//new ParamElemGSInt(peer, lapp, 337, CMD_.GET_APP_CHANNEL_ID_FIRST, CMD_.SET_APP_CHANNEL_ID_FIRST, INT16_MIN, INT16_MAX),
				//new ParamElemSInt(peer, lapp, 366, CMD_.APP_CHANNEL_ADD, INT16_MIN, INT16_MAX),
				//new ParamElemSInt(peer, lapp, 367, CMD_.APP_CHANNEL_DELETE, INT16_MIN, INT16_MAX),
				//new ParamElemSInt(peer, lapp, 368, CMD_.APP_STEP_ADD, INT16_MIN, INT16_MAX),
				//new ParamElemSInt(peer, lapp, 369, CMD_.APP_STEP_DELETE, INT16_MIN, INT16_MAX),
				new ParamElemGStr(peer, lapp, 320, CMD_.GET_APP_STATE),
				new ParamElemGStr(peer, lapp, 319, CMD_.GET_APP_ERROR),
				new SerialGroup(peer, lapp, 330)
			]),
			new MainGroup(317, [
				new ParamElemSCmd(peer, channel, 309, null, CMD_.CHANNEL_START, false),
				new ParamElemSCmd(peer, channel, 310, null, CMD_.CHANNEL_STOP, false),
				new ParamElemSCmd(peer, channel, 311, null, CMD_.CHANNEL_RELOAD, false),
				new ParamElemGGSEnum(peer, channel, 374, CMD_.GET_CHANNEL_DEVICE_KIND, CMD_.GETR_CHANNEL_DEVICE_KIND, CMD_.SET_CHANNEL_DEVICE_KIND, device_kind_list),
				new ParamElemGGSInt(peer, channel, 394, CMD_.GET_CHANNEL_PIN, CMD_.GETR_CHANNEL_PIN, CMD_.SET_CHANNEL_PIN, INT16_MIN, INT16_MAX),
				new ParamElemGGSFloat(peer, channel, 322, CMD_.GET_CHANNEL_GOAL, CMD_.GETR_CHANNEL_GOAL, CMD_.SET_CHANNEL_GOAL),
				new ParamElemGGSEnum(peer, channel, 360, CMD_.GET_CHANNEL_SAVE_GOAL, CMD_.GETR_CHANNEL_SAVE_GOAL, CMD_.SET_CHANNEL_SAVE_GOAL, yn_list),
				new ParamElemGStr(peer, channel, 320, CMD_.GETR_CHANNEL_STATE),
				new ParamElemGStr(peer, channel, 319, CMD_.GETR_CHANNEL_ERROR),
				new ParamElemGFTS(peer, channel, 318, CMD_.GETR_CHANNEL_FTS)
			]),
			new MainGroup(350, [
				new ParamElemGGSInt(peer, channel, 351, CMD_.GET_PWM_RESOLUTION, CMD_.GETR_PWM_RESOLUTION, CMD_.SET_PWM_RESOLUTION, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel, 375, CMD_.GET_PWM_PERIOD, CMD_.GETR_PWM_PERIOD, CMD_.SET_PWM_PERIOD, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel, 376, CMD_.GET_PWM_PW_MIN, CMD_.GETR_PWM_PW_MIN, CMD_.SET_PWM_PW_MIN, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel, 377, CMD_.GET_PWM_PW_MAX, CMD_.GETR_PWM_PW_MAX, CMD_.SET_PWM_PW_MAX, 0, INT32_MAX)
			]),
			new MainGroup(365, [
				new ParamElemGGSInt(peer, channel, 361, CMD_.GET_SERVO_PW_MIN, CMD_.GETR_SERVO_PW_MIN, CMD_.SET_SERVO_PW_MIN, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel, 362, CMD_.GET_SERVO_PW_MAX, CMD_.GETR_SERVO_PW_MAX, CMD_.SET_SERVO_PW_MAX, 0, INT32_MAX),
				new ParamElemGGSFloat(peer, channel, 363, CMD_.GET_SERVO_IN_MIN, CMD_.GETR_SERVO_IN_MIN, CMD_.SET_SERVO_IN_MIN),
				new ParamElemGGSFloat(peer, channel, 364, CMD_.GET_SERVO_IN_MAX, CMD_.GETR_SERVO_IN_MAX, CMD_.SET_SERVO_IN_MAX)
			]),
			new MainGroup(345, [
				new MainGroup(356, [
					new ParamElemGGSEnum(peer, channel, 347, CMD_.GET_PID_MODE, CMD_.GETR_PID_MODE, CMD_.SET_PID_MODE, regmode_list),
					new ParamElemGGSFloat(peer, channel, 400, CMD_.GET_PID_KP, CMD_.GETR_PID_KP, CMD_.SET_PID_KP, 0, INT32_MAX),
					new ParamElemGGSFloat(peer, channel, 401, CMD_.GET_PID_KI, CMD_.GETR_PID_KI, CMD_.SET_PID_KI, 0, INT32_MAX),
					new ParamElemGGSFloat(peer, channel, 402, CMD_.GET_PID_KD, CMD_.GETR_PID_KD, CMD_.SET_PID_KD, 0, INT32_MAX),
					new ParamElemGGSFloat(peer, channel, 372, CMD_.GET_PID_OUT_MIN, CMD_.GETR_PID_OUT_MIN, CMD_.SET_PID_OUT_MIN, 0, INT32_MAX),
					new ParamElemGGSFloat(peer, channel, 373, CMD_.GET_PID_OUT_MAX, CMD_.GETR_PID_OUT_MAX, CMD_.SET_PID_OUT_MAX, 0, INT32_MAX),
				]),
				new MainGroup(357, [
					new ParamElemGGSEnum(peer, channel, 347, CMD_.GET_POS2_MODE, CMD_.GETR_POS2_MODE, CMD_.SET_POS2_MODE, regmode_list),
					new ParamElemGGSFloat(peer, channel, 355, CMD_.GET_POS2_HYS, CMD_.GETR_POS2_HYS, CMD_.SET_POS2_HYS, 0, INT32_MAX),
					new ParamElemGGSInt(peer, channel, 348, CMD_.GET_POS2_OUT_MIN, CMD_.GETR_POS2_OUT_MIN, CMD_.SET_POS2_OUT_MIN, 0, INT32_MAX),
					new ParamElemGGSInt(peer, channel, 349, CMD_.GET_POS2_OUT_MAX, CMD_.GETR_POS2_OUT_MAX, CMD_.SET_POS2_OUT_MAX, 0, INT32_MAX),
				]),
			]),
			new MainGroup(358, [
				new ParamElemGEnum(peer, channel, 323, CMD_.GET_ID_EXISTS, yn_list)
			]),
			new MainGroup(340, [
				new ParamElemGGSEnum(peer, channel, 321, CMD_.GET_SEC_ENABLE, CMD_.GETR_SEC_ENABLE, CMD_.SET_SEC_ENABLE, yn_list),
				new ParamElemGGSInt(peer, channel, 338, CMD_.GET_SEC_TM, CMD_.GETR_SEC_TM, CMD_.SET_SEC_TM, 0, INT32_MAX),
				new ParamElemGGSFloat(peer, channel, 339, CMD_.GET_SEC_OUT, CMD_.GETR_SEC_OUT, CMD_.SET_SEC_OUT, 0, INT32_MAX),
				new ParamElemGStr(peer, channel, 320, CMD_.GETR_SEC_STATE)
			]),
			new MainGroup(341, [
				new ParamElemGGSInt(peer, channel,302, CMD_.GET_REM_ID, CMD_.GETR_REM_ID, CMD_.SET_REM_ID, INT16_MIN, INT16_MAX),
				new ParamElemGGSInt(peer, channel,342, CMD_.GET_REM_INTERVAL, CMD_.GETR_REM_INTERVAL, CMD_.SET_REM_INTERVAL, 0, INT32_MAX),
				new ParamElemGGSEnum(peer, channel, 343, CMD_.GET_REM_SERIAL, CMD_.GETR_REM_SERIAL, CMD_.SET_REM_SERIAL, sdev_list),
				new ParamElemGStr(peer, channel, 320, CMD_.GETR_REM_STATE),
				new ParamElemGStr(peer, channel, 319, CMD_.GETR_REM_ERROR)
			]),
			new MainGroup(344, [
				new ParamElemGGSInt(peer, channel, 302, CMD_.GET_RSENSOR_ID, CMD_.GETR_RSENSOR_ID, CMD_.SET_RSENSOR_ID, INT16_MIN, INT16_MAX),
				new ParamElemGGSInt(peer, channel, 342, CMD_.GET_RSENSOR_INTERVAL, CMD_.GETR_RSENSOR_INTERVAL, CMD_.SET_RSENSOR_INTERVAL, 0, INT32_MAX),
				new ParamElemGGSEnum(peer, channel, 343, CMD_.GET_RSENSOR_SERIAL, CMD_.GETR_RSENSOR_SERIAL, CMD_.SET_RSENSOR_SERIAL, sdev_list),
				new ParamElemGStr(peer, channel, 320, CMD_.GETR_RSENSOR_STATE),
				new ParamElemGStr(peer, channel, 319, CMD_.GETR_RSENSOR_ERROR)
			]),
			new MainGroup(386, [
				new ParamElemGSDate(peer, lapp, 384, CMD_.GET_RTC_DATE, CMD_.SET_RTC_DATE),
				new ParamElemGSTime(peer, lapp, 385, CMD_.GET_RTC_TIME, CMD_.SET_RTC_TIME)
			]),
			new MainGroup(387, [
				new ParamElemGGSTime(peer, channel, 388, CMD_.GET_TIMER_TIME_ON, CMD_.GETR_TIMER_TIME_ON, CMD_.SET_TIMER_TIME_ON),
				new ParamElemGGSTime(peer, channel, 389, CMD_.GET_TIMER_TIME_OFF, CMD_.GETR_TIMER_TIME_OFF, CMD_.SET_TIMER_TIME_OFF),
				new ParamElemGGSInt(peer, channel,390, CMD_.GET_TIMER_INTERVAL_ON, CMD_.GETR_TIMER_INTERVAL_ON, CMD_.SET_TIMER_INTERVAL_ON, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel,391, CMD_.GET_TIMER_INTERVAL_OFF, CMD_.GETR_TIMER_INTERVAL_OFF, CMD_.SET_TIMER_INTERVAL_OFF, 0, INT32_MAX)
			]),
			new MainGroup(403, [
				new ParamElemSStr(peer, channel, 404, CMD_.SET_INDICATOR_TEXT),
				new ParamElemSStr(peer, channel, 405, CMD_.SET_INDICATOR_TEXT_BLINK),
				new ParamElemGGSEnum(peer, channel, 406, CMD_.GET_INDICATOR_DISPLAY_KIND, CMD_.GETR_INDICATOR_DISPLAY_KIND, CMD_.SET_INDICATOR_DISPLAY_KIND, display_kind_list),
				new ParamElemGGSInt(peer, channel, 407, CMD_.GET_INDICATOR_DISPLAY_P1, CMD_.GETR_INDICATOR_DISPLAY_P1, CMD_.SET_INDICATOR_DISPLAY_P1, 0, PIN_MAX),
				new ParamElemGGSInt(peer, channel, 408, CMD_.GET_INDICATOR_DISPLAY_P2, CMD_.GETR_INDICATOR_DISPLAY_P2, CMD_.SET_INDICATOR_DISPLAY_P2, 0, PIN_MAX),
				new ParamElemGGSInt(peer, channel, 409, CMD_.GET_INDICATOR_DISPLAY_P3, CMD_.GETR_INDICATOR_DISPLAY_P3, CMD_.SET_INDICATOR_DISPLAY_P3, 0, PIN_MAX),
				new ParamElemGGSEnum(peer, channel, 410, CMD_.GET_INDICATOR_TEXT_ALIGNMENT, CMD_.GETR_INDICATOR_TEXT_ALIGNMENT, CMD_.SET_INDICATOR_TEXT_ALIGNMENT, text_alignment_list),
				new ParamElemGGSEnum(peer, channel, 411, CMD_.GET_INDICATOR_SERIAL_ID, CMD_.GETR_INDICATOR_SERIAL_ID, CMD_.SET_INDICATOR_SERIAL_ID, sdev_list),
				new ParamElemGGSEnum(peer, channel, 412, CMD_.GET_INDICATOR_MODE, CMD_.GETR_INDICATOR_MODE, CMD_.SET_INDICATOR_MODE, smode_list),
				new ParamElemGGSInt(peer, channel, 413, CMD_.GET_INDICATOR_REMOTE_ID, CMD_.GETR_INDICATOR_REMOTE_ID, CMD_.SET_INDICATOR_REMOTE_ID, 0, PIN_MAX),
				new ParamElemGGSEnum(peer, channel, 414, CMD_.GET_INDICATOR_ACP_COMMAND, CMD_.GETR_INDICATOR_ACP_COMMAND, CMD_.SET_INDICATOR_ACP_COMMAND, indicator_acp_command_list),
				new ParamElemGGSInt(peer, channel, 415, CMD_.GET_INDICATOR_TIME, CMD_.GETR_INDICATOR_TIME, CMD_.SET_INDICATOR_TIME, 0, INT32_MAX),
				new ParamElemGGSInt(peer, channel, 419, CMD_.GET_INDICATOR_FLOAT_PRECISION, CMD_.GETR_INDICATOR_FLOAT_PRECISION, CMD_.SET_INDICATOR_FLOAT_PRECISION, 0, CHANNEL_FLOAT_PRECISION_MAX)
			])
		];
		a(pcont, [this.ipaddrE, this.portE, this.channel.elem, this.app.elem, this.showaB]);
		a(this.container, [pcont]);
		a(this.container, this.elements);
		a(this.container, [this.textE]);
		this.initialized = true;
		this.updatePort();
		this.updateIPaddr();
		this.updateChannel();
		this.updateApp();
    };
    this.getName = function () {
        return trans.get(401);
    };
    this.updateStr = function () {
		this.channel.elem.title = trans.get(396);
		this.app.elem.title = trans.get(395);
		this.portE.title = trans.get(301);
		this.ipaddrE.title = trans.get(308);
		this.showaB.innerHTML = trans.get(421);
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].updateStr();
		}
    };
    this.updatePort = function(){
		this.peer.port = this.getInt(this.portE.value);
	};
	this.updateIPaddr = function(){
		this.peer.ipaddr = this.ipaddrE.value;
	};
	this.updateChannel = function(){
		this.channel.id = this.getInt(this.channel.elem.value); console.log("channel id: ", this.channel.id);
	};
	this.updateApp = function(){
		this.app.id = this.getInt(this.app.elem.value);
	};
	this.checkCommands = function(channel){
		for(var i = 0; i<this.elements.length; i++){
			this.elements[i].checkCommands(channel);
		}
	};
	this.markAllCommandsUnsupported = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].markAllCommandsUnsupported(); 
		}
	};
	this.markSupportedCommand = function(command){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].markSupportedCommand(command); 
		}
	};
	this.hideUnsupported = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].hideUnsupported();
		}
	};
	this.showSupported = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].showSupported();
		}
	};
	this.showAllElements = function(){
		for(var i=0; i<this.elements.length; i++){
			this.elements[i].showAllElements();
		}
	};
	this.getInt = function(v){
		var out = parseInt(v);
		if(isNaN(out)){
			return null;
		}
		return out;
	};
    this.show = function () {
		document.title = trans.get(1001);
		clr(this.container, "hdn");
		this.visible = true;
    };
    this.hide = function () {
		cla(this.container, "hdn");
        this.disableMainB();
		this.visible = false;
    };
    this.confirm = function (action, d, dt_diff) {
		switch (action) {
			case this.ACTION.GET_INFO:
				this.textE.innerHTML = d;
				break;
			case this.ACTION.GET_BINFO:
				this.textE.innerHTML = d;
				break;
			case this.ACTION.GET_SCONF:
				this.sconfE.setValue(d[0].p1);
				break;
			case this.ACTION.GET_SRATE:
				this.srateE.setValue(d[0].p1);
				break;
			case this.ACTION.SET_BDEFAULT:
			case this.ACTION.SET_ID:
			case this.ACTION.SET_SCONF:
			case this.ACTION.SET_SRATE:
				break;
			default:
				console.log("confirm: unknown action: ", action);
				break;
         }
	};
	this.abort = function (action, m, n) {
		switch (action) {
			case this.ACTION.GET_INFO:
				this.textE.innerHTML = "";
				break;
			case this.ACTION.GET_BINFO:
				this.textE.innerHTML = "";
				break;
			case this.ACTION.GET_SCONF:
				this.sconfE.setValue(null);
				break;
			case this.ACTION.GET_SRATE:
				this.srateE.setValue(null);
				break;
			case this.ACTION.SET_BDEFAULT:
			case this.ACTION.SET_ID:
			case this.ACTION.SET_SCONF:
			case this.ACTION.SET_SRATE:
				break;
			default:
				console.log("abort: unknown action: ", action);
				break;
		}
	};
}
var vmonitor = new Monitor();
visu.push(vmonitor);
