const generatePassword = require('password-generator');

exports.create = (req, res) => {
  const db = req.app.locals.db;

  const user = {
    username: req.payload.username,
    password: generatePassword(),
    name: req.payload.name,
    email: req.payload.email,
  };

  db.query('INSERT INTO users SET ?', user, (err, result) => {
    if (err) {
      console.log(err);
      res.send('Error while doing operation, Ex. non unique value').code(500);
    } else {
      res.json({ result });
    }
  });
};

exports.find = (req, res) => {
  const db = req.app.locals.db;

  let query = `
    SELECT * FROM users
    WHERE (username LIKE ? or name LIKE ?)
    ORDER BY username
    LIMIT ?,?`;
  const pagesize = parseInt(req.query.pagesize, 10);
  const pagenum = parseInt(req.query.pagenum, 10);
  const username = `${req.query.searchTxt}%`;
  const name = `%${req.query.searchTxt}%`;

  db.query(
    query, [username, name, pagenum * pagesize, pagesize],
    (err, rows) => {
      if (err) throw err;
      query = 'SELECT count(1) as totalRecords FROM users WHERE (username LIKE ? or name LIKE ?)';
      db.query(
        query, [username, name],
        (err2, rows2) => {
          if (err2) throw err2;
          const totalRecords = rows2[0].totalRecords;
          res.json({ data: rows, totalRecords });
        });
    });
};

exports.update = (req, res) => {
  const db = req.app.locals.db;

  const user = req.payload;
  const username = req.params.username;

  db.query(
  `UPDATE users SET name = ?,
  email = ?
  WHERE username = ?`,
    [
      user.name,
      user.email,
      username,
    ],
   (err, result) => {
     if (err) {
       console.log(err);
       res.send('Error while doing operation.').code(500);
     } else {
       res.json({ result });
     }
   });
};

exports.remove = (req, res) => {
  const db = req.app.locals.db;

  const username = req.params.username;

  db.query(
  'DELETE FROM users WHERE username = ? ',
  [username],
  (err, result) => {
    if (err) {
      console.log(err);
      res.send('Error while doing operation.').code(500);
    } else {
      res.json({ result });
    }
  });
};
