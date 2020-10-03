var PIN_MAX = 64;
var CHANNEL_FLOAT_PRECISION_MAX = 6;

var srate_list = [
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
var sconfig_list = [
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
var sdev_list = [
	{name: "no", value:0},
	{name: "Serial", value:1},
	{name: "Serial1", value:2},
	{name: "Serial2", value:3},
	{name: "Serial3", value:4},
];
var smode_list = [
	{name: "IDLE", value:0},
	{name: "SERVER", value:1},
	{name: "CLIENT", value:2},
	{name: "DEBUG", value:3},
	{name: "SPY", value:4}
];
var regmode_list = [
	{name: "HEATER", value:1},
	{name: "COOLER", value:0}
];
var regmethod_list = [
	{name: "PID", value:0},
	{name: "Pos2", value:1},
	{name: "Pos1", value:2}
];
var device_kind_list = [
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
var yn_list = [
	{name: "YES", value:1},
	{name: "NO", value:0}
];
var indicator_acp_command_list = [
	{name: "CMD_GETR_CHANNEL_FTS", value:CMD_.GETR_CHANNEL_FTS},
	{name: "CMD_GETR_CHANNEL_STATE", value:CMD_.GETR_CHANNEL_STATE},
	{name: "CMD_GETR_CHANNEL_ERROR", value:CMD_.GETR_CHANNEL_ERROR},
	{name: "CMD_SET_CHANNEL_GOAL", value:CMD_.SET_CHANNEL_GOAL}
];
var text_alignment_list = [
	{name: "LEFT", value:1},
	{name: "RIGHT", value:2}
];

var display_kind_list = [
	{name: "DEVICE_KIND_MAX7219", value:13},
	{name: "DEVICE_KIND_TM1637", value:14},
	{name: "DEVICE_KIND_DSERIAL", value:1}
];
    
var app = {
    NAME_SIZE: 32,
    controller_state: null,
    version: 1,
    controller_version: null,
    version_acceptable: {
        controller: [1],
        f_php: [2],
        f_js: [2]
    },
    init: function () {
         trans.active_lang=1;
    },
    update: function () {
        this.sendU();
    }
};
elem.push(app);
