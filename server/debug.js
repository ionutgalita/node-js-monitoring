var util = require('util');

var debug = true;

exports.showDebug = function(text) {

	if (debug) {

		console.log(text);

	}

	return;

}



