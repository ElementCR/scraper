var scraper = require('./scraper');
var argv = require('minimist')(process.argv.slice(2));
var assert = require('assert');

scraper.formObj.SearchStreetName = argv.name || '';
scraper.formObj.SearchStreetNumber = argv.number || '';
scraper.formObj.SearchParcel = argv.parcel || '';
scraper.formObj.SearchOwner  = argv.owner || '';

console.log('calling scraper.scrape');

scraper.scrape().then(function(res) {
	console.log('callback of scrape');
	console.log(' len: ' + res.length);
	console.log('And the next page url is: ' + scraper.nextPageUrl);

	if (res.length === 1) {
		// looks like we found a direct hit
		console.log(res[0]);
		
	}
	else {
		// do something else here
		console.log('Found ' + res.length + ' results.');
		console.log(res);
	}
 });
