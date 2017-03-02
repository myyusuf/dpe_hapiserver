const mysql = require('mysql');

const ConfigDB = require('./config/database.js');
const Routes = require('./routes');
const Auth = require('./auth');

exports.register = function (server, options, next) {

    const db = mysql.createConnection(ConfigDB.mysqlConnectionData);

    server.bind({ db: db });

    server.register(require('hapi-auth-bearer-token'), (err) => {

        if (err) {
            return next(err);
        }

        server.auth.strategy('api', 'bearer-access-token', {
            validateFunc: Auth.validateFunc.bind(db)
        });

        server.route(Routes);

        next();
    });
};

exports.register.attributes = {
    pkg: require('./package')
};
