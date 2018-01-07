const models = require('../models');
const ProjectionExcelReader = require('../helpers/projection_excel_reader');
const ProjectionBatchCreate = require('../helpers/batch_create/projection');

const DPEConstant = require('../config/dpe_constant.js');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAndCountAll = function findAndCountAll(req, res) {
  // const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Projection.findAndCountAll({
    where: {},
    order: ['month', 'year'],
    // include: [
    //   {
    //     model: models.Project,
    //     where: {
    //       $or: [
    //         { code: { $ilike: searchText } },
    //         { name: { $ilike: searchText } },
    //       ],
    //     },
    //   },
    // ],
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
  models.Projection.findAll({
    where: { year, month },
    order: ['month', 'year'],
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

  const projectionFile = req.files.projectionFile;
  const targetPath = `${DPEConstant.FILE_UPLOAD_DIR}temp_projection.xlsx`;
  projectionFile.mv(targetPath, (err) => {
    if (err) {
      res.status(500).send(err);
    }
    ProjectionExcelReader.readExcel(targetPath)
    .then((result) => {
      res.json(result);
    });
  });
};

exports.batchCreate = (req, res) => {
  ProjectionBatchCreate.process(req.body)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    res.json(err);
  });
};
