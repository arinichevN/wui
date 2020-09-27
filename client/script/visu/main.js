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
    this.channel = {id:null};
    this.app = {id:null};
    this.port = null;
    this.ipaddrE = null;
    this.portE = null;
    this.idE = null;
    this.idaE = null;
    this.textE = null;
	this.srate_list = [
		{name: "300", value:1},
		{name: "1200", value:2},
		{name: "2400", value:3},
		{name: "4800", value:4},
		{name: "9600", value:5},
		{name: "14400", value:6},
		{name: "19200", value:7},
		{name: "28800", value:8},
		{name: "38400", value:9},
		{name: "57600", value:10},
		{name: "115200", value:11}
	];
	this.sconf_list = [
		{name: "5N1", value: 0x00},
		{name: "6N1", value: 0x02},
		{name: "7N1", value: 0x04},
		{name: "8N1", value: 0x06},
		{name: "5N2", value: 0x08},
		{name: "6N2", value: 0x0A},
		{name: "7N2", value: 0x0C},
		{name: "8N2", value: 0x0E},
		{name: "5E1", value: 0x20},
		{name: "6E1", value: 0x22},
		{name: "7E1", value: 0x24},
		{name: "8E1", value: 0x26},
		{name: "5E2", value: 0x28},
		{name: "6E2", value: 0x2A},
		{name: "7E2", value: 0x2C},
		{name: "8E2", value: 0x2E},
		{name: "5O1", value: 0x30},
		{name: "6O1", value: 0x32},
		{name: "7O1", value: 0x34},
		{name: "8O1", value: 0x36},
		{name: "5O2", value: 0x38},
		{name: "6O2", value: 0x3A},
		{name: "7O2", value: 0x3C},
		{name: "8O2", value: 0x3E}
	];
	this.sdev_list = [
		{name: "no", value:0},
		{name: "Serial", value:1},
		{name: "Serial1", value:2},
		{name: "Serial2", value:3},
		{name: "Serial3", value:4},
	];
	this.smode_list = [
		{name: "IDLE", value:0},
		{name: "SERVER", value:1},
		{name: "CLIENT", value:2},
		{name: "DEBUG", value:3},
		{name: "SPY", value:4}
	];
	this.regmode_list = [
		{name: "HEATER", value:1},
		{name: "COOLER", value:0}
	];
	this.regmethod_list = [
		{name: "PID", value:0},
		{name: "Pos2", value:1},
		{name: "Pos1", value:2}
	];
	this.device_kind_list = [
		{name: "no", value:0},
		{name: "DSERIAL", value:1},
		{name: "MAX6675", value:2},
		{name: "MAX31855", value:3},
		{name: "DS18B20", value:4},
		{name: "SPWM", value:5},
		{name: "HPWM", value:6},
		{name: "DHT22", value:7},
		{name: "DHT22T", value:8},
		{name: "DHT22H", value:9},
		{name: "DS3231", value:10},
		{name: "TIMER", value:11},
		{name: "INDICATOR", value:12},
		{name: "DS3231", value:13},
		{name: "MAX7219", value:14},
		{name: "TM1637", value:15}
	];
	this.yn_list = [
		{name: "YES", value:1},
		{name: "NO", value:0}
	];
    this.init = function () {
		this.container = cvis();
		this.ipaddrE = c("input");
	    this.ipaddrE.type = "text";
	    this.ipaddrE.value = this.DEFAULT_IPADDR;
	    this.portE = c("input");
	    this.portE.type = "number";
	    this.portE.value = this.DEFAULT_PORT;
	    var self = this;
	    this.idE = c("input");
	    this.idE.type = "number";
	    this.idE.value = this.DEFAULT_CHANNEL_ID;
	    this.idaE = c("input");
	    this.idaE.type = "number";
	    this.idaE.value = this.DEFAULT_APP_ID;
	    this.textE = c('pre');
	    var self = this;
		this.portE.onchange = function(){
			self.updatePort();
		};
		this.ipaddrE.onchange = function(){
			self.updateIPaddr();
		};
		this.idE.onchange = function(){
			self.updateChannel();
		};
		this.idaE.onchange = function(){
			self.updateApp();
		};

		var pcont = cd();
		this.pwmG = new PWMGroup(this.peer, this.channel);
		this.servoG = new ServoGroup(this.peer, this.channel);
		this.regG = new RegGroup(this.peer, this.channel, this.regmethod_list, this.regmode_list);
		this.commonG = new CommonGroup(this.peer, this.channel, this.yn_list);
		this.channelG = new ChannelGroup(this.peer, this.channel, this.yn_list, this.device_kind_list);
		this.appG = new AppGroup(this.peer, this.app, this.sdev_list, this.srate_list, this.sconf_list, this.smode_list, this.yn_list);
		this.secureG = new SecureGroup(this.peer, this.channel, this.yn_list);
		this.emG = new EMGroup(this.peer, this.channel, this.sdev_list);
		this.sensorG = new SensorGroup(this.peer, this.channel, this.sdev_list);
		this.rtcG = new RTCGroup(this.peer, this.app);
		this.timerG = new TimerGroup(this.peer, this.channel);
		a(pcont, [this.ipaddrE, this.portE, this.idE, this.idaE]);
		a(this.container, [pcont]);
		a(this.container, [ this.commonG, this.appG, this.channelG, this.pwmG, this.servoG, this.sensorG, this.regG, this.sensorG, this.emG, this.secureG, this.rtcG, this.timerG]);
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
		this.idE.title = trans.get(396);
		this.idaE.title = trans.get(395);
		this.portE.title = trans.get(301);
		this.ipaddrE.title = trans.get(308);
		this.pwmG.updateStr();
		this.servoG.updateStr();
		this.regG.updateStr();
		this.emG.updateStr();
		this.sensorG.updateStr();
		this.secureG.updateStr();
		this.commonG.updateStr();
		this.channelG.updateStr();
		this.appG.updateStr();
		this.rtcG.updateStr();
		this.timerG.updateStr();
    };
    this.updatePort = function(){
		this.peer.port = this.getInt(this.portE.value);
	};
	this.updateIPaddr = function(){
		this.peer.ipaddr = this.ipaddrE.value;
	};
	this.updateChannel = function(){
		this.channel.id = this.getInt(this.idE.value);
	};
	this.updateApp = function(){
		this.app.id = this.getInt(this.idaE.value);
	};
	this.getInt = function(v){
		var out = parseInt(v);
		if(isNaN(out)){
			return null;
		}
		return out;
	};
	this.sendRequestSetCmdP2 = function (id, cmd, v) {
		if(v == null){
			return;	
		}
		
		var app_id = this.getAppId();
		if(app_id === null){
			return;
		}
		if(this.port === null){
			return;
		}
        var data = [
            {
                action: ['set_p2'],
                param: {address: this.ipaddrE.value, port: this.port, cmd:cmd, item: [{p0:app_id, p1:v1}]}
            }
        ];
        sendTo(this, data, id, 'json_dss');
    };
    this.sendRequestGetP2 = function (id, cmd) {
		var app_id = this.getAppId();
		if(app_id === null){
			return;
		}
		if(this.port === null){
			return;
		}
        var data = [
            {
                action: ['get_p2'],
                param: {address: this.ipaddrE.value, port: this.port, cmd:cmd, item: [app_id]}
            }
        ];
        sendTo(this, data, id, 'json_dss');
    };
	this.sendRequestCmd = function (id, cmd) {
		var app_id = this.getAppId();
		if(app_id === null){
			return;
		}
		if(this.port === null){
			return;
		}
        var data = [
            {
                action: ['set_cmd'],
                param: {address: this.ipaddrE.value, port: this.port, cmd:cmd, item: [app_id]}
            }
        ];
        sendTo(this, data, id, 'json_dss');
    };
    this.sendRequestGetText = function (id, cmd) {
		var app_id = this.getAppId();
		if(app_id === null){
			return;
		}
		if(this.port === null){
			return;
		}
        var data = [
            {
                action: ['get_text'],
                param: {address: this.ipaddrE.value, port: this.port, cmd:cmd, item: [app_id]}
            }
        ];
        sendTo(this, data, id, 'json_dss');
    };
    this.sendRequestGetTextBroadcast = function (id, cmd) {
		if(this.port === null){
			return;
		}
        var data = [
            {
                action: ['get_text_broadcast'],
                param: {address: this.ipaddrE.value, port: this.port, cmd:cmd}
            }
        ];
        sendTo(this, data, id, 'json_dss');
    };
    this.show = function () {
		document.title = trans.get(401);
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
