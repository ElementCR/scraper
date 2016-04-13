var cheerio = require('cheerio');
var request = require('request');

const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';
var formObj = {};

var results = [];

var scrapeSite = function() {
	console.log('scrapeSite called');
	return new Promise(function(resolve, reject) {
		
		request = request.defaults( { jar: true } );
		request.post({ url: SEARCH_URL, form: scraper.formObj }, function(err, httpResponse, html) {
			if (err) reject(err);

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
					parcelBits = rowObj.parcelId.split(' ');
					rowObj.controlMap = parcelBits[0];
					rowObj.group = parcelBits[1];
					rowObj.parcel = parcelBits[2];
					results.push(rowObj)
				}
			});
			// Check to see if there is a next page and if so, recursively call
			var next = $("a.button:contains('Next Page')");
			if (next.length > 0) {
				scraper.nextPageUrl = SEARCH_BASE + next.attr('href');
				// request.post( { url: SEARCH_BASE + next.attr('href'), form: formObj }, scrapeSite);
			}
			else {
				scraper.nextPageUrl = '';
			}
			resolve(results);
		});
	});
};


var scrapeIt = function scrapeIt() {
	request = request.defaults( { jar: true } );
	request.post({ url: SEARCH_URL,	form: scraper.formObj }, scraper.scrapeSite);
};

var scrape = function scrape() {
	console.log('scrape called');
	return new Promise(function(resolve, reject) {
		scrapeSite().then(function(res) {
			console.log('We got back from the promise....');
			resolve(res);
		});
	});
};
	

var scraper = {
	formObj: {},
	nextPageUrl: '',
	scrapeSite: scrapeSite,
	scrapeIt: scrapeIt,
	scrape: scrape
};

//exports.formObj = formObj;
//exports.foo = function() { return 'foo'; }
//exports.scrapeSite = scrapeSite;

module.exports = scraper;
