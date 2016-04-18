var Property = sequelize.define('property', {
	parcelId: { // '169A H 027',
		type: Sequelize.STRING,
		field: 'parcelId'
	},
	accountUrl: {
		type: Sequelize.STRING,
		field: 'accountUrl'
	},
	accountNumber: {
		type: Sequelize.STRING,
		field: accountNumber
	},
	location: {
		type: Sequelize.STRING,
		field: location
	}
	owner: {
		type: Sequelize.STRING,
		field: owner
	}
	/*
	yearBuilt: '1955',
	totalValue: '$153,700',
	squareFootage: '2,384',
	description: 'RESIDENTIAL',
	saleDate: '12/11/2009',
	salePrice: '$119,900',
	bookPage: '9076-0371',
	controlMap: '169A',
	group: 'H',
	parcel: '027',
	printableCard:
	{ mailingAddress:
			{ owner: ' PIERCE ANDREW M ',
				city: ' CHATTANOOGA',
				state: ' TN',
				address: ' 822 BELVOIR TER',
				zip: ' 37412' } } }
	
	firstName: {
		type: Sequelize.STRING,
		field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
	},
	lastName: {
		type: Sequelize.STRING
	}
	*/
}, {
	freezeTableName: true // Model tableName will be the same as the model name
});

Property.sync({force: true}).then(function () {
	// Table created
	return Property.create({
		owner: 'Pierce, Andrew',
		location: 'Belvoir Terrace'
	});
});
