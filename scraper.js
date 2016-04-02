var cheerio = require('cheerio');
var request = require('request');

const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';
var formObj = {};



var scrapeSite = function scrapeSite(err, httpResponse, html) {
	if (err) throw(err);

	var $ = cheerio.load(html);
	const cols = [ "parcelId", "location", "owner", "yearBuilt", "totalValue", "squareFootage", "description", "saleDate", "salePrice", "bookPage" ];
	
	// parse through the results table
	$('#T1 tr').each(function(x, rowElement) {
		// get each row and parse it's childs
		var row = $(this);
		var rowObj = {};

		row.find('td').each(function(y, colElement) {
			var text = $(this).text().replace(/\r?\n|\r/g, '').replace(/\t/g, ' ').trim();
			rowObj[cols[y]] = text;
		});
		if (Object.getOwnPropertyNames(rowObj).length != 0) {

			// var list = new Listing.Listing(rowObj);
			//console.log(list);
			//list.save(function(err, list) {
			//	if (err) return console.log(err);
			console.log(rowObj);
			//});
		}
	});
	// Check to see if there is a next page and if so, recursively call
	var next = $("a.button:contains('Next Page')");
	if (next.length > 0) {
		request.post( { url: SEARCH_BASE + next.attr('href'), form: formObj }, scrapeSite);
	}
};


var scrapeIt = function scrapeIt() {
	request = request.defaults( { jar: true } );
	request.post({ url: SEARCH_URL,	form: scraper.formObj }, scraper.scrapeSite);
};
	

var scraper = {
	formObj: {},
	scrapeSite: scrapeSite,
	scrapeIt: scrapeIt,
};

//exports.formObj = formObj;
//exports.foo = function() { return 'foo'; }
//exports.scrapeSite = scrapeSite;

module.exports = scraper;
