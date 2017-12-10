const models = require('../models');
const ExcelReader = require('../helpers/excel_reader');

const DPEConstant = require('../config/dpe_constant.js');

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

exports.upload = (req, res) => {
  if (!req.files) {
    res.status(400).send('No files were uploaded.');
  }

  const projectProgressFile = req.files.projectProgressFile;
  const targetPath = `${DPEConstant.FILE_UPLOAD_DIR}temp_project_progress.xlsx`;
  projectProgressFile.mv('targetPath', (err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.send('File uploaded!');
  });

  const callback = (result) => {
    res.json(result);
  };
  ExcelReader.readExcel(targetPath, this.db, callback);
};
