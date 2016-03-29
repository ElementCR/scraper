'use strict';
const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';

var scraper = require('./scraper');

var request = require('request')
var argv = require('minimist')(process.argv.slice(2));

var assert = require('assert');
// var Listing = require('./models/listing');

//var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/nmls');
// var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error: '));
//db.once('connect', function() {
	// we're connected

console.log(scraper.formObj);
	request = request.defaults( { jar: true } );
	scraper.formObj.SearchStreetName = argv.name || '';
	scraper.formObj.SearchStreetNumber = argv.number || '';
	scraper.formObj.SearchParcel = argv.parcel || '';
	scraper.formObj.SearchOwner  = argv.owner || '';


console.log(scraper.formObj);
console.log(scraper.foo());
console.log('calling the scrape func');
//});
request.post({ url: SEARCH_URL,	form: scraper.formObj }, scraper.scrapeSite);
