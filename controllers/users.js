'use strict';

const generatePassword = require('password-generator');

exports.create = function (req, res) {
  
  const db = req.app.locals.db;

  const user = {
    username: request.payload.username,
    password: generatePassword(),
    name: request.payload.name,
    email: request.payload.email,
  };

  db.query('INSERT INTO users SET ?', user, function(err, result){
    if(err){
      console.log(err);
      req.json('Error while doing operation, Ex. non unique value').code(500);
    }else{
      req.json({ status: 'ok' });
    }
  });
};

exports.find = function(req, res) {

  var db = this.db;

  var query = `
    SELECT * FROM users 
    WHERE (username LIKE ? or name LIKE ?) 
    ORDER BY username 
    LIMIT ?,?`;
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var username = request.query.searchTxt + '%';
  var name = '%' + request.query.searchTxt + '%';

  db.query(
    query, [username, name, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;
      const query = 'SELECT count(1) as totalRecords FROM users WHERE (username LIKE ? or name LIKE ?)';
      db.query(
        query, [username, name],
        function(err, rows2) {
          if (err) throw err;

          var totalRecords = rows2[0].totalRecords;
          req.json({data: rows, totalRecords: totalRecords});
        }
      );
    }
  );
};

exports.update = function (req, res) {

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
      req.json('Error while doing operation.').code(500);
    }else{
      req.json({ status: 'ok' });
    }
  });
};

exports.delete = function(req, res) {

  var username = request.params.username;

  this.db.query(
  'DELETE FROM users WHERE username = ? ',
  [username],
  function (err, result) {
    if(err){
      console.log(err);
      req.json('Error while doing operation.').code(500);
    }else{
      req.json({ status: 'ok' });
    }
  });
};
