'use strict';

exports.home = function (request, reply) {

    reply.view('index', {
        user: request.auth.credentials.username
    });
};

exports.login = function (request, reply) {
    reply.view('login', {}, {layout: 'login_layout'});
};
