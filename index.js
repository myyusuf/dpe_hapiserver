'use strict';

const Hapi = require('hapi');
const mysql = require('mysql');
const configDB = require('./config/database.js');

//Mysql
const db = mysql.createConnection(configDB.mysqlConnectionData);

// Creating a Hapi server

const server = new Hapi.Server();
server.connection({
    port: 4000
});

server.bind({ db: db });

// Registering the Good plugin

server.register([
  {
    register: require('good'),
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*'
            }
        }]
    }
  },
  {
    register: require('inert')
  },
  {
    register: require('vision')
  }
], (err) => {

    if (err) {
        throw err;
    }

    // Setting up routes

    server.route(require('./routes'));

    // Starting the server

    server.start((err) => {

        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
});
