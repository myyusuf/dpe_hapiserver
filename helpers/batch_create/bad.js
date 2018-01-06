const models = require('../../models');

const deleteBadTable = year => (
  new Promise((resolve, reject) => {
    models.Bad.destroy({
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

const getProjectIds = () => (
  new Promise((resolve, reject) => {
    const projectIds = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let i = 0; i < projects.length; i += 1) {
        const project = projects[i];
        projectIds[project.code] = project.id;
      }
      resolve(projectIds);
    })
    .catch((err) => {
      reject(err);
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const payload = batchData.payload;
    let year;
    if (payload.length > 0) {
      year = payload[0].year;
    }
    const bads = [];

    deleteBadTable(year)
    .then(() => {
      getProjectIds()
      .then((projectIds) => {
        for (let i = 0; i < payload.length; i += 1) {
          const tmp = payload[i];
          const projectCode = tmp.projectCode;
          const projectId = projectIds[projectCode];
          if (projectId) {
            const piutangUsaha = tmp.piutangUsaha;
            const tagihanBruto = tmp.tagihanBruto;
            const piutangRetensi = tmp.piutangRetensi;
            const pdp = tmp.pdp;
            const bad = tmp.bad;
            const month = tmp.month;
            bads.push({
              ProjectId: projectId,
              piutangUsaha,
              tagihanBruto,
              piutangRetensi,
              pdp,
              bad,
              year,
              month,
            });
          }
        }
        models.Bad.bulkCreate(bads)
        .then(() => {
          resolve({
            status: 'OK',
          });
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
