
const NO=0;
const YES=1;
const FAILURE=0;
const SUCCESS=1;

const DAYS_IN_YEAR = 403;
const DAYS_IN_MONTH = 31;

const SECONDS_IN_MINUTE = 60;
const SECONDS_IN_HOUR = 3600;

const serial_rate_list = [
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
const serial_dps_list = [
	{name: "5N1", value: 1},
	{name: "6N1", value: 2},
	{name: "7N1", value: 3},
	{name: "8N1", value: 4},
	{name: "5N2", value: 5},
	{name: "6N2", value: 6},
	{name: "7N2", value: 7},
	{name: "8N2", value: 8},
	{name: "5E1", value: 9},
	{name: "6E1", value: 10},
	{name: "7E1", value: 11},
	{name: "8E1", value: 12},
	{name: "5E2", value: 13},
	{name: "6E2", value: 14},
	{name: "7E2", value: 15},
	{name: "8E2", value: 16},
	{name: "5O1", value: 17},
	{name: "6O1", value: 18},
	{name: "7O1", value: 19},
	{name: "8O1", value: 20},
	{name: "5O2", value: 21},
	{name: "6O2", value: 22},
	{name: "7O2", value: 23},
	{name: "8O2", value: 24}
];


	
const serial_device_list = [
	{name: "no", value:0},
	{name: "Serial0", value:1},
	{name: "Serial1", value:2},
	{name: "Serial2", value:3},
	{name: "Serial3", value:4},
];
const serial_mode_list = [
	{name: "IDLE", value:0},
	{name: "SERVER", value:1},
	{name: "CLIENT", value:2},
	{name: "DEBUG", value:3},
	{name: "SPY", value:4}
];
const regmode_list = [
	{name: "HEATER", value:1},
	{name: "COOLER", value:0}
];
const regmethod_list = [
	{name: "PID", value:0},
	{name: "Pos2", value:1},
	{name: "Pos1", value:2}
];
const device_kind_list = [
	{name: "UNKNOWN", value: 0},
	{name: "AI18", value: 1},
	{name: "AI22", value: 2},
	{name: "AI5566", value: 3},
	{name: "AOUT", value: 4},
	{name: "AIND", value: 5},
	{name: "DSERIAL", value: 6},
	{name: "MAX6675", value: 7},
	{name: "MAX31855", value: 8},
	{name: "DS18B20", value: 9},
	{name: "SPWM", value: 10},
	{name: "HPWM", value: 11},
	{name: "DHT22", value: 12},
	{name: "DHT22T", value: 13},
	{name: "DHT22H", value: 14},
	{name: "DS3231", value: 15},
	{name: "TIMER", value: 16},
	{name: "INDICATOR", value: 17},
	{name: "MAX7219", value: 18},
	{name: "TM1637", value: 19},
	{name: "DSLED", value: 20},
	{name: "ATD32", value: 21}
];

const yn_list = [
	{name: "YES", value:YES},
	{name: "NO", value:NO}
];
const indicator_acp_command_list = [
	{name: "CMD_NOID_GET_FTS", value:CMD_NOID_GET_FTS},
	{name: "CMD_NOID_GET_STATE", value:CMD_NOID_GET_STATE},
	{name: "CMD_NOID_GET_ERROR", value:CMD_NOID_GET_ERROR},
	{name: "CMD_NOID_SET_GOAL", value:CMD_NOID_SET_GOAL}
];
const text_alignment_list = [
	{name: "LEFT", value:1},
	{name: "RIGHT", value:2}
];

const aout_channel_device_kind_list = [
	{name: "UNKNOWN", value: 0},
	{name: "SPWM", value: 10},
	{name: "HPWM", value: 11}
];

const pin_state_list = [
	{name: "HIGH", value:1},
	{name: "LOW", value:0}
];

const pin_mode_list = [
	{name: "INPUT", value:0},
	{name: "OUTPUT", value:1},
	{name: "INPUT_PULLUP", value:2}
];

const ds18b20_resolution_list = [
	{name: "9", value:9},
	{name: "10", value:10},
	{name: "11", value:11},
	{name: "12", value:12}
];

const error_list = [
	{name: "no", value: 0},
	{name: "Efst", value: 1},
	{name: "Esome", value: 2},
	{name: "Wread", value: 3},
	{name: "Wdata", value: 4},
	{name: "Eparam", value: 5},
	{name: "Esubb", value: 6},
	{name: "Ebstat", value: 7},
	{name: "Edevkn", value: 8},
	{name: "Egoal", value: 9},
	{name: "Esgoal", value: 10},
	{name: "Emeth", value: 11},
	{name: "Eout", value: 12},
	{name: "Epidm", value: 13},
	{name: "Epidkp", value: 14},
	{name: "Epidki", value: 15},
	{name: "Epidkd", value: 16},
	{name: "Ep2md", value: 17},
	{name: "Ep2hys", value: 18},
	{name: "Epwm", value: 19},
	{name: "Envread", value: 20},
	{name: "Eread", value: 21},
	{name: "Echns", value: 22},
	{name: "Esrvnds", value: 23},
	{name: "Eserial", value: 24},
	{name: "Eseriald", value: 25},
	{name: "Eserialr", value: 26},
	{name: "Eseriald", value: 27},
	{name: "Eserialm", value: 28},
	{name: "Eserialb", value: 29},
	{name: "Enoser", value: 30},
	{name: "Esend", value: 31},
	{name: "Ebadres", value: 32},
	{name: "Epl", value: 33},
	{name: "Eslst", value: 34},
	{name: "Eslsp", value: 35},
	{name: "Eretry", value: 36},
	{name: "Etmco", value: 37},
	{name: "Etmcsv", value: 38},
	{name: "Etmcsg", value: 39},
	{name: "Ertc", value: 40},
	{name: "Envram", value: 41},
	{name: "Enoid", value: 42},
	{name: "Eaoid", value: 43},
	{name: "E1wire", value: 44}
];

const state_list = [
	{name: "?", value: 0},
	{name: "BUSY", value: 1},
	{name: "IDLE", value: 2},
	{name: "RUN", value: 3},
	{name: "OFF", value: 4},
	{name: "DONE", value: 5},
	{name: "FAILURE", value: 6},
	{name: "INIT", value: 7}
];

const aind_channel_mode_list = [
	{name: "?", value:0},
	{name: "SERVER", value:1},
	{name: "CLIENT", value:2},
	{name: "SPY", value:3}
];
