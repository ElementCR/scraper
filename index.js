'use strict';
const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';

var fs = require('fs');
var request = require('request')
var cheerio = require('cheerio');
var argv = require('minimist')(process.argv.slice(2));

var formObj = {};

request = request.defaults( { jar: true } );
formObj.SearchStreetName = argv.name || '';
formObj.SearchStreetNumber = argv.number || '';
formObj.SearchParcel = argv.parcel || '';
formObj.SearchOwner  = argv.owner || '';


var scraper = function scraper(err, httpResponse, html) {
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
			console.log(rowObj);
		}
	});

	// Check to see if there is a next page and if so, recursively call
	var next = $("a.button:contains('Next Page')");
	if (next.length > 0) {
		request.post( { url: SEARCH_BASE + next.attr('href'), form: formObj }, scraper);
	}
};


request.post({ url: SEARCH_URL,	form: formObj }, scraper);
