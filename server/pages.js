var pages = {};

exports.getPages = function() {

	return pages;
}

exports.addPage = function(page, pages) {

	if (page in pages){

		pages[page] = pages[page] + 1;

	} else {

		pages[page] = 1;
	
	}
}