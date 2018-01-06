const models = require('../../models');

const getExistingProjectCodes = () => (
  new Promise((resolve, reject) => {
    models.Project.findAll({
      where: {},
    })
    .then((rows) => {
      const projectCodes = rows.map(row => row.code);
      resolve(projectCodes);
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const YEAR = batchData.year;
    const projectProgresses = batchData.projectProgresses;
    console.log(projectProgresses);

    models.ProjectProgress.destroy(
      {
        where: { year: YEAR },
      })
    .then(() => {
      getExistingProjectCodes()
      .then((existingProjectCodes) => {
        resolve({
          status: 'OK',
          payload: existingProjectCodes,
        });
      })
      .catch((err) => {
        reject({
          status: 'ERROR',
          payload: err.message,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      reject({
        status: 'ERROR',
        payload: err.message,
      });
    });
  })
);
