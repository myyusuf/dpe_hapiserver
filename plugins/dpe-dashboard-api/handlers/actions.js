// const Bcrypt = require('bcrypt-nodejs');

exports.login = function (request, reply) {

    const sql = 'SELECT * FROM users WHERE username = ?';

    // console.log('request.payload : ' + JSON.stringify(request.payload));

    this.db.query(sql, [request.payload.username], (err, result) => {

        if (err) {
            throw err;
        }

        var user = null;
        if(result.length > 0){
          user = result[0];
        }

        if (!user) {
            return reply('Not authorized').code(401);
        }

        reply({
            token: user.token,
            username: user.username
        });

        // Bcrypt.compare(request.payload.password, user.password, (err, res) => {
        //
        //     if (err) {
        //         throw err;
        //     }
        //
        //     if (!res) {
        //         return reply('Not authorized').code(401);
        //     }
        //
        //     reply({
        //         token: user.token,
        //         username: user.username
        //     });
        // });
    });
};
