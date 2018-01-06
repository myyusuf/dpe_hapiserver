const Lsp = require('../helpers/batch_create/lsp');

exports.batchCreate = (req, res) => {
  Lsp.process(req.body)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    res.json(err);
  });
};
