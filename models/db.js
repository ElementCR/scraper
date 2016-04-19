var Sequelize = require('sequelize');

var sequelize = new Sequelize(process.env.SCRAPER_DB, process.env.SCRAPER_USER, process.env.SCRAPER_PASS, {
	host: 'localhost',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});


module.exports = sequelize;
