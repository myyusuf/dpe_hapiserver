const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const models = require('../models');
const DPEConstant = require('../config/dpe_constant.js');

const sendLoginFailedMessage = (req, res) => {
  res.status(403).send('Invalid username or password');
};

exports.signIn = function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  models.User.findOne({
    where: { username },
    include: [
      {
        model: models.Role,
      },
    ],
  })
  .then((user) => {
    if (user !== null && user.Role !== null) {
      // bcrypt.compare(password, user.password, function(err, bcryptResult) {
      //   if (bcryptResult) {
      //     const token = jwt.sign({
      //       name: user.name,
      //       role: user.role
      //     }, TOKEN_PASSWORD);
      //     res.send(token);
      //   } else {
      //     sendLoginFailedMessage(req, res);
      //   }
      // });
      if (password === user.password) {
        const token = jwt.sign({
          name: user.name,
          role: user.Role.code,
        }, DPEConstant.TOKEN_PASSWORD);
        res.json({
          status: 'OK',
          token,
          role: user.Role.code,
        });
      } else {
        sendLoginFailedMessage(req, res);
      }
    } else {
      sendLoginFailedMessage(req, res);
    }
  });
};
