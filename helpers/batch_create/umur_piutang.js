const models = require('../../models');

const deletePiutangTable = year => (
  new Promise((resolve, reject) => {
    models.Piutang.destroy({
      where: { year },
    })
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

const insertPiutang = projectData => (
  new Promise((resolve, reject) => {
    const projectCodes = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i];
        projectCodes[project.code] = project.id;
      }

      const tempProjectData = projectData;
      tempProjectData.ProjectId = projectCodes[projectData.projectCode];
      delete tempProjectData.projectCode;
      models.Piutang.create(tempProjectData)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        reject(err);
      });
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const year = batchData.year;
    const allProjectsDataInAYear = batchData.payload;
    const promises = [];
    deletePiutangTable(year)
    .then(() => {
      for (let i = 0; i < allProjectsDataInAYear.length; i += 1) {
        promises.push(insertPiutang(allProjectsDataInAYear[i]));
      }
      Promise.all(promises)
      .then(() => {
        resolve({ status: 'OK' });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
