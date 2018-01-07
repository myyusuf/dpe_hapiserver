const models = require('../../models');

const deleteProjectionTable = year => (
  new Promise((resolve, reject) => {
    models.Projection.destroy({
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

const bulkInsertProjection = projections => (
  new Promise((resolve, reject) => {
    models.Projection.bulkCreate(projections)
    .then((result) => {
      resolve(result);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const year = batchData.year;
    const projectionsDataInAYear = batchData.payload;
    deleteProjectionTable(year)
    .then(() => {
      bulkInsertProjection(projectionsDataInAYear).then(() => {
        resolve({ status: 'OK' });
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
