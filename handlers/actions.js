exports.login = function (request, reply) {
  request.cookieAuth.set({
      token: '12345',
      username: 'yusuf'
  });
  reply.redirect(this.webBaseUrl);
};

exports.logout = function (request, reply) {
  request.cookieAuth.clear();
  reply.redirect(this.webBaseUrl + '/login');
};
