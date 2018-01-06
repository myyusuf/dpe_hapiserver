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

const insertToDb = (existingProjectCodes, projectProgresses) => (
  new Promise((resolve, reject) => {
    let theExistingProjectCodes = [];
    if (existingProjectCodes) {
      theExistingProjectCodes = existingProjectCodes;
    }
    // debugger;
    const promises = [];
    const unrecoredProjectProgresses = projectProgresses.filter(projectProgress => (
      !theExistingProjectCodes.includes(projectProgress.projectCode)
    ));

    if (unrecoredProjectProgresses.length > 0) {
      const unrecoredProjectCodes = unrecoredProjectProgresses.map(projectProgress => (
        projectProgress.projectCode
      ));

      const uniq = function uniq(a) {
        return Array.from(new Set(a));
      };

      const unrecoredProjectCodesUnique = uniq(unrecoredProjectCodes);

      reject({
        cause: 'UNRECORDED_PROJECT_CODES',
        payload: unrecoredProjectCodesUnique,
      });
      return;
    }

    const projectCodes = {};
    models.Project.findAll({
      where: {},
    }).then((projects) => {
      for (let indexProject = 0; indexProject < projects.length; indexProject += 1) {
        const project = projects[indexProject];
        projectCodes[project.code] = project.id;
      }

      for (let i = 0; i < projectProgresses.length; i += 1) {
        const projectCode = projectProgresses[i].projectCode;
        const year = projectProgresses[i].year;
        const month = projectProgresses[i].month;

        const rkapOk = projectProgresses[i].rkapOk;
        const rkapOp = projectProgresses[i].rkapOp;
        const rkapLk = projectProgresses[i].rkapLk;

        const realisasiOk = projectProgresses[i].realisasiOk;
        const realisasiOp = projectProgresses[i].realisasiOp;
        const realisasiLk = projectProgresses[i].realisasiLk;

        const prognosaOk = projectProgresses[i].prognosaOk;
        const prognosaOp = projectProgresses[i].prognosaOp;
        const prognosaLk = projectProgresses[i].prognosaLk;

        promises.push(new Promise((resolve2, reject2) => {
          models.ProjectProgress.create({
            year,
            month,
            rkapOk,
            rkapOp,
            rkapLk,
            realisasiOk,
            realisasiOp,
            realisasiLk,
            prognosaOk,
            prognosaOp,
            prognosaLk,
            ProjectId: projectCodes[projectCode],
          })
          .then(() => {
            resolve2({
              // affectedRows: result.affectedRows,
              // projectCode,
            });
          })
          .catch((err) => {
            reject2(err);
          });
        }));
      }

      Promise.all(promises)
      .then((results) => {
        resolve(results);
      })
      .catch((err) => {
        reject(err);
      });
    });
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const YEAR = batchData.year;
    const projectProgresses = batchData.projectProgresses;

    models.ProjectProgress.destroy(
      {
        where: { year: YEAR },
      })
    .then(() => {
      getExistingProjectCodes()
      .then((existingProjectCodes) => {
        insertToDb(existingProjectCodes, projectProgresses)
        .then(() => {
          resolve({
            status: 'OK',
          });
        })
        .catch((err) => {
          console.error(err);
          reject(err);
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
