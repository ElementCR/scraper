var mongoose = require('mongoose');

var schema = listingSchema = mongoose.Schema({
	parcelId: String,
	location: String,
	owner: String,
	yearBuilt: { type: Number, min: 1700, max: 2100 },
	totalValue: String,
	squareFootage: Number,
	description: String,
	saleDate: String,
	salePrice: Number,
	bookPage: String
});

var Listing = mongoose.model('Listing', schema);

exports.Listing = Listing;


