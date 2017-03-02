'use strict';

exports.home = function (request, reply) {

  if (request.auth.isAuthenticated) {
    reply.view('index', {
        user: request.auth.credentials.username
    });
  }else{
    return reply.redirect(this.webBaseUrl + '/login');
  }

};

exports.login = function (request, reply) {
    reply.view('login', {}, {layout: 'login_layout'});
};
