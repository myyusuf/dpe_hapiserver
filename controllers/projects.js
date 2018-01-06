const models = require('../models');

const sendError = (err, res) => {
  res.status(500).send(`Error while doing operation: ${err.name}, ${err.message}`);
};

exports.findAll = function findAll(req, res) {
  const searchText = req.query.searchText ? `%${req.query.searchText}%` : '%%';
  const limit = req.query.pageSize ? parseInt(req.query.pageSize, 10) : 10;
  const currentPage = req.query.currentPage ? parseInt(req.query.currentPage, 10) : 1;
  const offset = (currentPage - 1) * limit;
  models.Project.findAndCountAll({
    where: {
      $or: [
        { code: { $ilike: searchText } },
        { name: { $ilike: searchText } },
      ],
    },
    order: ['code'],
    include: [
      { model: models.ProjectType },
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

exports.findOne = function findOne(req, res) {
  models.Project.findOne({
    where: { id: req.params.projectId },
  })
  .then((project) => {
    res.json(project);
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.create = function create(req, res) {
  const projectForm = req.body;
  const projectTypeId = projectForm.projectType;

  models.ProjectType.findOne({
    where: { id: projectTypeId },
  })
  .then((projectType) => {
    models.Project.create(projectForm)
    .then((project) => {
      project.setProjectType(projectType)
      .then((result) => {
        res.json(result);
      });
    })
    .catch((err) => {
      sendError(err, res);
    });
  });
};

exports.update = function update(req, res) {
  const projectForm = req.body;
  const projectTypeId = projectForm.projectType;

  models.Project.findOne({
    where: { id: req.params.projectId },
  })
  .then((project) => {
    models.ProjectType.findOne({
      where: { id: projectTypeId },
    })
    .then((projectType) => {
      project.setProjectType(projectType)
      .then(() => {
        project.code = projectForm.code;
        project.name = projectForm.name;

        project.save()
        .then((saveResult) => {
          res.json(saveResult);
        });
      });
    });
  })
  .catch((err) => {
    sendError(err, res);
  });
};

exports.destroy = function destroy(req, res) {
  models.Project.destroy(
    {
      where: { id: req.params.projectId },
    })
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    sendError(err, res);
  });
};
