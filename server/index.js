var httpStart = require('./server');
var users = require('./users');
var urls = require('./pages');
var debug = require('./debug');

var count = 0;

var server = httpStart.createServer();

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {

  return true;
}

wsServer.on('request', function(r, d){

    var connection = r.accept('json', r.origin);
    var clients = users.getClients();
    var admins = users.getAdmins();
    var pages = urls.getPages();

    var page;

    var id;
 	
	connection.on('message', function(message) {

			var req = JSON.parse(message.utf8Data);

			page = req.path.substr(1);

			if (!req.isAdmin) {
			
				id = users.clientAdd(connection);

				urls.addPage(page, pages);

				
			} else {

				id = users.adminAdd(connection);

			}

			users.adminSend(page, pages);


	});

	connection.on('close', function(reasonCode, description) {


		users.connClose(id, page, pages);
	    

	});
});