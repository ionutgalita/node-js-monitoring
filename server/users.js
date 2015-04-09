var uuid = require('node-uuid');

var admins = {};
var clients = {};

exports.getAdmins = function() {

	return admins;
}

exports.getClients = function() {

	return clients;
}

exports.clientAdd = function(connection) {

	var id = uuid.v4();

	clients[id] = connection;

	return id;
}

exports.adminAdd = function(connection) {

	var id = uuid.v4();

	admins[id] = connection;

	return id;
}

exports.adminSend = function(page, pages) {

	var sendMess = {};

	sendMess.clients = Object.keys(clients).length;
	sendMess.pages = pages;

	for(var i in admins){

		admins[i].send(JSON.stringify(sendMess));
	}
}

exports.connClose = function(id, page, pages) {

	var deleted = false;

	console.log(id + ' ' + Object.keys(clients).length);

	for (var c in clients) {

			if (c == id) {

				delete clients[id];

				deleted = true;

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

				delete admins[id];

			}
		
		}

	}

}