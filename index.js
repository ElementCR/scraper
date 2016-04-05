var scraper = require('./scraper');
var argv = require('minimist')(process.argv.slice(2));
var assert = require('assert');


scraper.formObj.SearchStreetName = argv.name || '';
scraper.formObj.SearchStreetNumber = argv.number || '';
scraper.formObj.SearchParcel = argv.parcel || '';
scraper.formObj.SearchOwner  = argv.owner || '';

// scraper.scrapeIt();

console.log('calling scraper.scrape');

scraper.scrape().then(function(res) {
	console.log('callback of scrape');
	console.log(' len: ' + res.length);
	// console.log(res);
 });
