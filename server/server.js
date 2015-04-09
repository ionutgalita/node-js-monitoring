var http = require('http');
var uuid = require('node-uuid');
var util = require('util');

var count = 0;

var server = http.createServer(function(request, response){
	

});

server.listen(1234, function() {

    console.log('Server is listening on port 1234');

});

var WebSocketServer = require('websocket').server;

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

(function(global) {

	var clients = {};

	global.getClients = function() {return clients;};

})(global);

(function(global) {

	var admins = {};

	global.getAdmins = function() {return admins;};

})(global);

(function(global) {

	var pages = {};

	global.getPages = function() {return pages;};

})(global);

wsServer.on('request', function(r, d){

    var connection = r.accept('json', r.origin);
    var clients = getClients();
    var admins = getAdmins();
    var pages = getPages();

    var page;

    var id;
 	
	console.log('New connection detected!');

	console.log('Origin : ['  + r.origin + ']');

	// Create event listener
	connection.on('message', function(message) {

			var req = JSON.parse(message.utf8Data);

			page = req.path.substr(1);

			id = uuid.v4();

			console.log('Admin : ' + req.isAdmin);

			if (!req.isAdmin) {
			
				clients[id] = connection;

				console.log('New Client Unique ID : [' + id + ']');

				console.log('Path : [' + page + ']');

				if (page in pages){

					pages[page] = pages[page] + 1;

				} else {

					pages[page] = 1;
				}

				console.log('Connected clients : [' + Object.keys(clients).length + ']');

				console.log('Connected admins : [' + Object.keys(admins).length + ']');

				
			} else {

				admins[id] = connection;

				console.log('New Admin Unique ID : [' + id + ']');

				console.log('Connected clients : [' + Object.keys(clients).length + ']');

				console.log('Connected admins : [' + Object.keys(admins).length + ']');

			}

			var sendMess = {};

			sendMess['clients'] = Object.keys(clients).length;
			sendMess['pages'] = pages;

			for(var i in admins){

			        admins[i].send(JSON.stringify(sendMess));
			}


			console.log('============================================');
	

	});

	connection.on('close', function(reasonCode, description) {

		var deleted = false;

		console.log('Disconnect detected!');

		for (var c in clients) {

			if (c == id) {

				delete clients[id];

				deleted = true;

				console.log('Deleting Client with ID : [' + id + ']');

				var sendMess = {};

				pages[page] = pages[page] - 1;

				if (pages[page] == 0) {

					delete pages[page];
				}

				sendMess['clients'] = Object.keys(clients).length;
				sendMess['pages'] = pages;

				for(var i in admins){

			        admins[i].send(JSON.stringify(sendMess));
				}
			}
		}


		if (!deleted) {

			for (var a in admins) {

				if (a == id) {

					console.log('Deleting Admin with ID : [' + id + ']');

					delete admins[id];

				}
			}


		}
	    


		console.log('Connected clients : [' + Object.keys(clients).length + ']');

		console.log('Connected admins : [' + Object.keys(admins).length + ']');

	    console.log('============================================');

	    

	});
});