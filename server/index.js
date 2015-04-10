var httpStart = require('./server');
var users = require('./users');
var urls = require('./pages');
var debug = require('./debug');

var server = httpStart.createServer();

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {

  return true;
}

/* For testing */

var ips = ['66.12.197.152',
			'221.92.218.235',
			'51.7.26.98',
			'180.55.27.16',
			'242.35.194.86',
			'38.162.213.181',
			'53.50.105.209',
			'146.112.213.211',
			'123.156.109.89',
			'247.73.70.44',
			'79.96.141.4',
			'150.168.19.137'
			];

/* End */

wsServer.on('request', function(r, d){

    var connection = r.accept('json', r.origin);
    var clients = users.getClients();
    var admins = users.getAdmins();
    var pages = urls.getPages();

    var page,
		id,
   		ip;
 	
	connection.on('message', function(message) {

			var req = JSON.parse(message.utf8Data);

			page = req.path.substr(1);

			ip = ips[Math.floor(Math.random()*ips.length)];

			if (!req.isAdmin) {
			
				id = users.clientAdd(connection);

				urls.addPage(page, pages, ip);

				
			} else {

				id = users.adminAdd(connection, ip);

			}

			users.adminSend(page, pages);


	});

	connection.on('close', function(reasonCode, description) {


		users.connClose(id, page, pages, ip);
	    

	});
});