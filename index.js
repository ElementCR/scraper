var scraper = require('./scraper');
var argv = require('minimist')(process.argv.slice(2));
var assert = require('assert');


scraper.formObj.SearchStreetName = argv.name || '';
scraper.formObj.SearchStreetNumber = argv.number || '';
scraper.formObj.SearchParcel = argv.parcel || '';
scraper.formObj.SearchOwner  = argv.owner || '';

scraper.scrapeIt();

