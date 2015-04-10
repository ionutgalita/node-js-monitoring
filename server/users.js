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

exports.connClose = function(id, page, pages, ip) {

	var deleted = false;

	for (var c in clients) {

			if (c == id) {

				delete clients[id];

				deleted = true;

				var sendMess = {};

				var ips = pages[page].ips;

				var ipIndex = ips.indexOf(ip);

				ips.splice(ipIndex, 1);

				pages[page].count = pages[page].count - 1;

				pages[page].ips = ips;

				if (pages[page].count === 0) {

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