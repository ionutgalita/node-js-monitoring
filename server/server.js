var http = require('http');

exports.createServer = function() {
	
	var server = http.createServer(function(request, response){
		

	});

	server.listen(1234, function() {

	    console.log('Server is listening on port 1234');

	});


	return server;
}