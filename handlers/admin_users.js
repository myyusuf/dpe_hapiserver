'use strict';

const generatePassword = require('password-generator');

exports.create = function (request, reply) {

  var user = {
    username: request.payload.username,
    password: generatePassword(),
    name: request.payload.name,
    email: request.payload.email,
  };

  this.db.query('INSERT INTO users SET ?', user, function(err, result){
    if(err){
      console.log(err);
      reply('Error while doing operation, Ex. non unique value').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};

exports.find = function(request, reply) {

  var db = this.db;

  var query = "SELECT * FROM users WHERE (username LIKE ? or name LIKE ?) " +
  "ORDER BY username LIMIT ?,? ";
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var username = request.query.searchTxt + '%';
  var name = '%' + request.query.searchTxt + '%';

  db.query(
    query, [username, name, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT count(1) as totalRecords FROM users WHERE (username LIKE ? or name LIKE ?) ";
      db.query(
        query, [username, name],
        function(err, rows2) {
          if (err) throw err;

          var totalRecords = rows2[0].totalRecords;
          reply({data: rows, totalRecords: totalRecords});
        }
      );
    }
  );
};

exports.update = function (request, reply) {

  var user = request.payload;
  var username = request.params.username;

  this.db.query(
  'UPDATE users SET name = ?, '+
  'email = ? ' +
  'WHERE username = ?',
  [
    user.name,
    user.email,
    username
  ],
  function (err, result) {
    if(err){
      console.log(err);
      reply('Error while doing operation.').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};

exports.delete = function(request, reply) {

  var username = request.params.username;

  this.db.query(
  'DELETE FROM users WHERE username = ? ',
  [username],
  function (err, result) {
    if(err){
      console.log(err);
      reply('Error while doing operation.').code(500);
    }else{
      reply({ status: 'ok' });
    }
  });
};
