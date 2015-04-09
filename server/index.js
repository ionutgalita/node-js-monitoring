var httpStart = require('./server');
var users = require('./users');
var urls = require('./pages');
var debug = require('./debug');
var uuid = require('node-uuid');

var count = 0;

var server = httpStart.createServer();

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(r, d){

    var connection = r.accept('json', r.origin);
    var clients = users.getClients();
    var admins = users.getAdmins();
    var pages = urls.getPages();

    var page;

    var id;
 	
	debug.showDebug('New connection detected!');

	debug.showDebug('Origin : ['  + r.origin + ']');

	// Create event listener
	connection.on('message', function(message) {

			var req = JSON.parse(message.utf8Data);

			page = req.path.substr(1);

			id = uuid.v4();

			debug.showDebug('Admin : ' + req.isAdmin);

			if (!req.isAdmin) {
			
				clients[id] = connection;

				debug.showDebug('New Client Unique ID : [' + id + ']');

				debug.showDebug('Path : [' + page + ']');

				if (page in pages){

					pages[page] = pages[page] + 1;

				} else {

					pages[page] = 1;
				}

				debug.showDebug('Connected clients : [' + Object.keys(clients).length + ']');

				debug.showDebug('Connected admins : [' + Object.keys(admins).length + ']');

				
			} else {

				admins[id] = connection;

				debug.showDebug('New Admin Unique ID : [' + id + ']');

				debug.showDebug('Connected clients : [' + Object.keys(clients).length + ']');

				debug.showDebug('Connected admins : [' + Object.keys(admins).length + ']');

			}

			var sendMess = {};

			sendMess.clients = Object.keys(clients).length;
			sendMess.pages = pages;

			for(var i in admins){

			        admins[i].send(JSON.stringify(sendMess));
			}


			debug.showDebug('============================================');
	

	});

	connection.on('close', function(reasonCode, description) {

		var deleted = false;

		debug.showDebug('Disconnect detected!');

		for (var c in clients) {

			if (c == id) {

				delete clients[id];

				deleted = true;

				debug.showDebug('Deleting Client with ID : [' + id + ']');

				var sendMess = {};

				pages[page] = pages[page] - 1;

				if (pages[page] === 0) {

					delete pages[page];
				}

				sendMess.clients = Object.keys(clients).length;
				sendMess.pages = pages;

				for(var i in admins){

			        admins[i].send(JSON.stringify(sendMess));
				}
			}
		}


		if (!deleted) {

			for (var a in admins) {

				if (a == id) {

					debug.showDebug('Deleting Admin with ID : [' + id + ']');

					delete admins[id];

				}
			}


		}
	    


		debug.showDebug('Connected clients : [' + Object.keys(clients).length + ']');

		debug.showDebug('Connected admins : [' + Object.keys(admins).length + ']');

	    debug.showDebug('============================================');

	    

	});
});