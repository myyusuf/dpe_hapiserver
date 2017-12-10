const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.ProjectProgress.findAndCountAll({
    where: {},
    include: [
      {
        model: models.Project,
        where: {
          $or: [
            { code: { $ilike: searchText } },
            { name: { $ilike: searchText } },
          ],
        },
      },
    ],
    limit,
    offset,
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

// exports.fileUpload = (req, res) => {
//   if (!req.files) {
//     return res.status(400).send('No files were uploaded.');
//   }
//
//   // The name of the input field (i.e. "seminarFile") is used to retrieve the uploaded file
//   const seminarFile = req.files.seminarFile;
//   const seminarId = req.params.seminarId;
//
//   const workbook = new Excel.Workbook();
//   const stream = new Readable();
//   stream._read = function noop() {};
//   stream.push(seminarFile.data);
//   stream.push(null);
// };
