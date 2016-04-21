'use strict';

var Property = require('./models/property');
const Hapi = require('hapi');



var getProperties = function getProperties(request, reply) {
	var props = '';
	
	Property.findAll({}).then(function(properties) {
		properties.forEach(function(property) {
			console.log(property.parcelId);
			props += property.parcelId + "<br/>";
		});
		reply.view('index', { properties: props }) ;
	});
};


const server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: '3001'
});

server.register(require('vision'), (err) => {
	server.views({
		engines: {
			hbs: require('handlebars'),
			pug: require('pug')
		},
		relativeTo: __dirname,
		path: 'templates'
	});
});


server.route({
	method: 'GET',
	path: '/properties',
	handler: getProperties
})

server.route({
	method: 'GET',
	path: '/test',
	handler: function(request, reply) {
		// reply.view('hello', { first_name: 'Andrew' });
		reply.view('pindex', { first_name: 'Andrew' });
	}
});


server.start((err) => {
	if (err) throw err;
	console.log('Server running at ' + server.info.uri);
});

