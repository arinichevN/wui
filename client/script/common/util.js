const UNKNOWN_STR = "&empty;";
const BLINK_TM = 200;

const INT8_MIN = -128;
const INT8_MAX = 127;

const INT16_MIN = -32768;
const INT16_MAX = 32767;

const INT32_MIN = -2147483648;
const INT32_MAX = 2147483647;

const UINT8_MIN = 0;
const UINT8_MAX = 255;

const UINT16_MIN = 0;
const UINT16_MAX = 65535;

const UINT32_MIN = 0;
const UINT32_MAX = 4294967295;

const FLOAT_MIN = -100000.0;
const FLOAT_MAX = 100000.0;
const FLOAT_PRECISION = 3;


function getDaysInMonth(y, m){
	switch(m){
		case 1: return 31;
		case 2: if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) return 29; else return 28;
		case 3: return 31;
		case 4: return 30;
		case 5: return 31;
		case 6: return 30;
		case 7: return 31;
		case 8: return 31;
		case 9: return 30;
		case 10: return 31;
		case 11: return 30;
		case 12: return 31;
	}
}

function todToStr(v){
	let h = v / SECONDS_IN_HOUR;
	let m = (v % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE;
	let s = v % SECONDS_IN_MINUTE;
	return Math.floor(h) + ":" + Math.floor(m) + ":" + s;
}

function remoteGetAcpData_bl(slave, id, peer, package){
	if(peer.port === null || peer.paddr === null) return;
	let data = [
		{
			action: ['get_data'],
			param: {ipaddr: peer.ipaddr, port: peer.port, packs: package, pack_count: 1}
		}
	];
	cursor_blocker.enable();
	sendTo(slave, data, id, 'server');
}

function remoteSetAcpData_bl(slave, id, peer, package){
	if(peer.port === null || peer.paddr === null) return;
	let data = [
		{
			action: ['set_data'],
			param: {ipaddr: peer.ipaddr, port: peer.port, packs: package, pack_count: 1}
		}
	];
	cursor_blocker.enable();
	sendTo(slave, data, id, 'server');
}

function blinkElemGood(elem){
	blink(elem, "pr_success", BLINK_TM);
}

function blinkElemBad(elem){
	blink(elem, "pr_failed", BLINK_TM);
}

function updateStrElemBad(elem){
	elem.innerHTML = UNKNOWN_STR;
	blinkElemBad(elem);
}

function updateStrElemGood(elem, v){
	elem.innerHTML = v;
	blinkElemGood(elem);
}

function aoidIntParamResponseToElemInnerHTML(elem, acp_response){
	let elemv = null;
	if(v !== null){
		let data = acp_parseResponse(acp_response, {v1:null, v2:null, v3:null, v4:null});
		if(data instanceof Array && data.length == 1){
			let app_id = parseInt(data[0].v1);
			let id = parseInt(data[0].v2);
			let val = parseInt(data[0].v3);
			let success = parseInt(data[0].v4);
			if(!(isNaN(app_id) || isNaN(id) || isNaN(val) || isNaN(success))){
				if(app_id == this.master.app_id && id == this.id){
					if(success == YES){
						elemv = val;
					}
				}
			}
		}
	}
	if(elemv !== null){
		updateStrElemGood(elem, elemv);
	}else{
		updateStrElemBad(elem);
	}
}

function aoidGetIntMin(aoid_kind){
	switch(aoid_kind){
		case AOID_KIND_INT8_PARAM: return INT8_MIN;
		case AOID_KIND_INT16_PARAM: return INT16_MIN;
		case AOID_KIND_INT32_PARAM: return INT32_MIN;
		case AOID_KIND_UINT8_PARAM: return UINT8_MIN;
		case AOID_KIND_UINT16_PARAM: return UINT16_MIN;
		case AOID_KIND_UINT32_PARAM: return UINT32_MIN;
		case AOID_KIND_TIME_PARAM: return UINT16_MIN;
		case AOID_KIND_TIMEMS_PARAM: return UINT16_MIN;
		case AOID_KIND_TIMEUS_PARAM: return UINT16_MIN;
		case AOID_KIND_TIMES_PARAM: return UINT16_MIN;
	}
	return 0;
}

function aoidGetIntMax(aoid_kind){
	switch(aoid_kind){
		case AOID_KIND_INT8_PARAM: return INT8_MAX;
		case AOID_KIND_INT16_PARAM: return INT16_MAX;
		case AOID_KIND_INT32_PARAM: return INT32_MAX;
		case AOID_KIND_UINT8_PARAM: return UINT8_MAX;
		case AOID_KIND_UINT16_PARAM: return UINT16_MAX;
		case AOID_KIND_UINT32_PARAM: return UINT32_MAX;
		case AOID_KIND_TIME_PARAM: return UINT16_MAX;
		case AOID_KIND_TIMEMS_PARAM: return UINT16_MAX;
		case AOID_KIND_TIMEUS_PARAM: return UINT16_MAX;
		case AOID_KIND_TIMES_PARAM: return UINT16_MAX;
	}
	return 0;
}

function enumGetStr(list, v){
	for(let i=0;i<list.length;i++){
		if(list[i].value === v){
			return list[i].name;
		}
	}
	return UNKNOWN_STR;
}

function getInt(v){
	let out = parseInt(v);
	if(isNaN(out)){
		return null;
	}
	return out;
}
