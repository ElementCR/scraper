'use strict';

var cheerio = require('cheerio');
var request = require('request');
request = request.defaults( { jar: true } );

const SEARCH_BASE = 'http://assessor.hamiltontn.gov/';
const SEARCH_URL = 'http://assessor.hamiltontn.gov/search.aspx';
var formObj = {};

var results = [];

var scrapePrintableCard = function(results) {
	console.log('scrapePrintableCard called with ' + results[0].accountNumber);
	
	return new Promise(function(resolve, reject) {
		var pc = {
			mailingAddress: {}
		};
		var pcUrl = SEARCH_BASE + 'Summary.aspx?AccountNumber=' + results[0].accountNumber;

		request.post({ url: pcUrl }, function(err, httpResponse, html) {
			if (err) reject(err);

			var $ = cheerio.load(html);

			var tables = $('table');
			// debugger;
			
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
					// debugger;
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
	console.log('scrapeSite called');
	return new Promise(function(resolve, reject) {
		
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

					if (y === 0) {
						// get the account number from the href here
						rowObj.accountUrl = $(this).children().first().attr('href');
						rowObj.accountNumber = rowObj.accountUrl.split('=')[1];
					}
				});
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
			resolve(results);
		});
	});
};

var scrape = function scrape() {
	console.log('scrape called');
	return new Promise(function(resolve, reject) {
		
		scrapeSite().then(scrapePrintableCard).then(function(res) {
			// debugger;
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
