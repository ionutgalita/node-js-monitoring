var pages = {};

exports.getPages = function() {

	return pages;
}

exports.addPage = function(page, pages, ip) {

	if (page in pages){

		ips = pages[page].ips;

		ips.push(ip);

		pages[page].count = pages[page].count + 1;
		pages[page].ips = ips;

	} else {

		pages[page] = {count : 1, ips : [ip]};

	
	}
}
