const Claim = require('../helpers/batch_create/claim');

exports.batchCreate = (req, res) => {
  Claim.process(req.body)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    res.json(err);
  });
};
