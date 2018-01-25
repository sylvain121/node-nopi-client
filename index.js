const request = require('request');


let config = {
	login: null,
	password: null,
	hostname: null,
	interval: 0,
	last: {
		statusCode: 0,
		message: null,
		ip: null
	}
}

let timer = null;

function buildHttpRequest(config) {
	return 'http://'+
		config.login+
		':'+
		config.password+
		"@dynupdate.no-ip.com/nic/update?"+
		"hostname="+
		config.hostname;
}

function register(config) {
	if(!config.login) return "missing login";
	if(!config.password) return "missing password";
	if(!config.hostname) return "missing hostname";
	if(!config.interval) return "missing interval";

	let req = buildHttpRequest(config);
	timer = setInterval(()=> {
		request(req, function (error, response, body) {
		
			if(error) {
				config.last.statusCode = response.statusCode;
				config.last.message = error;
			} else {
				body = body.replace(/(\r\n|\n|\r)/gm,"");	
				config.last.statusCode = response.statusCode;
				config.last.message = body;
				let s = body.split(" ");
				config.last.ip = s[1];
			}
		}); 
	}, config.interval * 60 * 1000);
}

function clear() {
	clearInterval(timer);
}

module.exports = {
	config,
	register,
	clear
}

