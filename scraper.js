'use strict';

var cheerio = require('cheerio');
var request = require('request');
var Property = require('./models/property');
var _ = require('lodash-node');

request = request.defaults( { jar: true } );

const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';
var formObj = {};

var results = [];

var scrapePrintableCard = function(results) {
	
	return new Promise(function(resolve, reject) {
		var pc = {
			mailingAddress: {}
		};
		var pcUrl = SEARCH_BASE + 'Summary.aspx?AccountNumber=' + results[0].accountNumber;

		request.post({ url: pcUrl }, function(err, httpResponse, html) {
			if (err) reject(err);

			var $ = cheerio.load(html);

			var tables = $('table');
			
			// Get the address section
			var mailingAddr = $('table.old-parcel-id');

			mailingAddr.find('td').each(function(x, col) {
				let td = $(this);
				// debugger;
				if (td.children().first().text() === 'Owner') {
					// get the next element
					let sib = td.siblings().first();
					pc.mailingAddress.owner = sib.text();
				}
				if (td.children().first().text() === 'Address') {
					// get the next element
					let sib = td.siblings().first();
					pc.mailingAddress.address = sib.text();
				}
				if (td.children().first().text() === 'City') {
					// get the next element
					let sib = td.siblings().next().next().next();
					pc.mailingAddress.city = sib.text();
				}
				if (td.children().first().text() === 'State') {
					// get the next element
					let sib = td.siblings().next().next().next();
					pc.mailingAddress.state = sib.text();
				}
				if (td.children().first().text() === 'Zip') {
					// get the next element
					let sib = td.siblings().next().next().next();
					pc.mailingAddress.zip = sib.text();
				}
			});
			
			results[0].printableCard = pc;
			resolve(results);
		});
	});
};

var scrapeSite = function() {
	return new Promise(function(resolve, reject) {
		
		request.post({ url: SEARCH_URL, form: scraper.formObj }, function(err, httpResponse, html) {
			if (err) reject(err);

			var $ = cheerio.load(html);
			const cols = [ "parcelId", "location", "owner", "yearBuilt", "totalValue", "squareFootage",
										 "description", "saleDate", "salePrice", "bookPage" ];
			
			// parse through the results table
			$('#T1 tr').each(function(x, rowElement) {
				// get each row and parse it's children
				var row = $(this);
				var rowObj = {};

				row.find('td').each(function(y, colElement) {
					var text = $(this).text().replace(/\r?\n|\r/g, '').replace(/\t/g, ' ').trim();
					rowObj[cols[y]] = text;

					if (y === 0) {
						// get the account number from the href here
						rowObj.accountUrl = $(this).children().first().attr('href');
						rowObj.accountNumber = rowObj.accountUrl.split('=')[1];
					}
				});

				// fix the values that should be numbers
				if (!_.isEmpty(rowObj)) {
					if (!_.isEmpty(rowObj.salePrice)) {
						rowObj.salePrice = parseInt(rowObj.salePrice.replace(/\$|,/g, ""));
					}
					else {
						rowObj.salePrice = 0;
					}
					if (!_.isEmpty(rowObj.totalValue)) {
						rowObj.totalValue = parseInt(rowObj.totalValue.replace(/\$|,/g, ""));
					}
					else {
						rowObj.totalValue = 0;
					}
					if (!_.isEmpty(rowObj.squareFootage)) {
						rowObj.squareFootage = parseInt(rowObj.squareFootage.replace(/,/g, ""));
					}
					else {
						rowObj.squareFootage = 0;
					}
				}
				
				if (Object.getOwnPropertyNames(rowObj).length != 0) {
					let parcelBits = rowObj.parcelId.split(' ');
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
			console.log("Done scraping with " + results.length + " results");
			resolve(results);
		});
	});
};

var scrape = function scrape() {
	return new Promise(function(resolve, reject) {
		scrapeSite().then(scrapePrintableCard).then(function(res) {
			// add this result to the database
			res.forEach(function(result) {
				var prop = Property.create(result);
			});
			resolve(res);
		});
	});
};
	

var scraper = {
	formObj: {},
	nextPageUrl: '',
	scrapeSite: scrapeSite,
	scrape: scrape
};

module.exports = scraper;
