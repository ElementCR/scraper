var sequelize = require('./db');
var Sequelize = require('sequelize');

var Property = sequelize.define('property', {
	parcelId: {
		type: Sequelize.STRING,
		field: 'parcel_id'
	},
	accountUrl: {
		type: Sequelize.STRING,
		field: 'account_url'
	},
	accountNumber: {
		type: Sequelize.STRING,
		field: 'account_number'
	},
	location: {
		type: Sequelize.STRING,
		field: 'location'
	},
	owner: {
		type: Sequelize.STRING,
		field: 'owner'
	},
	yearBuilt: {
		type: Sequelize.STRING,
		field: 'year_built'
	},
	totalValue: {
		type: Sequelize.INTEGER,
		field: 'total_value'
	},
	squareFootage: {
		type: Sequelize.INTEGER,
		field: 'square_footage'
	},
	description: {
		type: Sequelize.STRING,
		field: 'description'
	},
	saleDate: {
		type: Sequelize.DATEONLY,
		field: 'sale_date'
	},
	salePrice: {
		type: Sequelize.INTEGER,
		field: 'sale_price'
	},
	bookPage: {
		type: Sequelize.STRING,
		field: 'book_page'
	},
	controlMap: {
		type: Sequelize.STRING,
		field: 'control_map'
	},
	group: {
		type: Sequelize.STRING,
		field: 'group'
	},
	parcel: {
		type: Sequelize.STRING,
		field: 'parcel'
	}
	/*
	printableCard:
	{ mailingAddress:
			{ owner: ' PIERCE ANDREW M ',
				city: ' CHATTANOOGA',
				state: ' TN',
				address: ' 822 BELVOIR TER',
				zip: ' 37412' } } }
	*/
}, {
	freezeTableName: true // Model tableName will be the same as the model name
});


module.exports = Property;

/*
Property.sync({force: true}).then(function () {
	// Table created
	return Property.create({
		owner: 'Pierce, Andrew',
		location: 'Belvoir Terrace'
	});
});
*/


