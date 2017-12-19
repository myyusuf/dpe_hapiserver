const models = require('../models');
const BadExcelReader = require('../helpers/bad_excel_reader');

const DPEConstant = require('../config/dpe_constant.js');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAndCountAll = function findAndCountAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Bad.findAndCountAll({
    where: {},
    order: [[models.Project, 'code'], 'month', 'year'],
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

exports.findAll = function findAll(req, res) {
  const year = req.params.year;
  const month = req.params.month;

  models.Bad.findAll({
    where: { year, month },
    order: [[models.Project, 'code'], 'month', 'year'],
    include: [
      {
        model: models.Project,
        where: {},
      },
    ],
  })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.fileUpload = (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
  }

  const badFile = req.files.badFile;
  const targetPath = `${DPEConstant.FILE_UPLOAD_DIR}temp_bad.xlsx`;
  badFile.mv(targetPath, (err) => {
    if (err) {
      res.status(500).send(err);
    }
    BadExcelReader.readExcel(targetPath)
    .then((result) => {
      res.json(result);
    });
  });
};
