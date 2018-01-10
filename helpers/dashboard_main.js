const sequelize = require('sequelize');
const models = require('../models');
const Flow = require('nimble');

exports.getMainData = (month, year, resultCallback) => {
  const result = {};

  const getLatesRealizationMonth = (callback) => {
    models.ProjectProgress.findAll({
      where: { year, realisasiOk: { $gt: 0 } },
      attributes: [
        'month',
        [sequelize.fn('sum', sequelize.col('realisasiOk')), 'sum_realisasi_ok'],
      ],
      group: ['month'],
    })
    .then((rows) => {
      if (rows.length > 0) {
        let maxMonth = 1;
        for (let i = 0; i < rows.length; i += 1) {
          const projectProgressSum = rows[i].dataValues;
          if (projectProgressSum.sum_realisasi_ok > 0 && projectProgressSum.month >= maxMonth) {
            maxMonth = projectProgressSum.month;
          }
        }
        result.latestRealizationMonth = maxMonth;
      } else {
        result.latestRealizationMonth = 1;
      }
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  const getSumProjectProgressPerMonth = (callback) => {
    models.ProjectProgress.findAll({
      where: { year, month: { $lte: month } },
      include: [
        {
          model: models.Project,
          include: [
            {
              model: models.ProjectType,
            },
          ],
        },
      ],
    })
    .then((rows) => {
      const projectTypes = {};
      const sums = [];
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i];
        if (!projectTypes[row.Project.ProjectType.id]) {
          projectTypes[row.Project.ProjectType.id] = [];
        }
        projectTypes[row.Project.ProjectType.id].push(row);
      }
      const keys = Object.keys(projectTypes);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const projectProgresses = projectTypes[key];
        let sumRkapOk = 0;
        let sumRkapOp = 0;
        let sumRkapLk = 0;
        let sumRealisasiOk = 0;
        let sumRealisasiOp = 0;
        let sumRealisasiLk = 0;
        let sumPrognosaOk = 0;
        let sumPrognosaOp = 0;
        let sumPrognosaLk = 0;
        for (let j = 0; j < projectProgresses.length; j += 1) {
          const projectProgress = projectProgresses[j];
          sumRkapOk += projectProgress.rkapOk;
          sumRkapOp += projectProgress.rkapOp;
          sumRkapLk += projectProgress.rkapLk;
          sumRealisasiOk += projectProgress.realisasiOk;
          sumRealisasiOp += projectProgress.realisasiOp;
          sumRealisasiLk += projectProgress.realisasiLk;
          sumPrognosaOk += projectProgress.prognosaOk;
          sumPrognosaOp += projectProgress.prognosaOp;
          sumPrognosaLk += projectProgress.prognosaLk;
        }
        sums.push({
          project_type: key,
          sum_rkap_ok: sumRkapOk,
          sum_rkap_op: sumRkapOp,
          sum_rkap_lk: sumRkapLk,
          sum_realisasi_ok: sumRealisasiOk,
          sum_realisasi_op: sumRealisasiOp,
          sum_realisasi_lk: sumRealisasiLk,
          sum_prognosa_ok: sumPrognosaOk,
          sum_prognosa_op: sumPrognosaOp,
          sum_prognosa_lk: sumPrognosaLk,
        });
      }

      const sortedSums = sums.sort((obj1, obj2) => obj1.project_type - obj2.project_type);
      result.sumProjectProgressPerMonth = sortedSums;
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  const getSumProjectProgressLastMonthOfYear = (callback) => {
    models.ProjectProgress.findAll({
      where: { year },
      include: [
        {
          model: models.Project,
          include: [
            {
              model: models.ProjectType,
            },
          ],
        },
      ],
    })
    .then((rows) => {
      const projectTypes = {};
      const sums = [];
      for (let i = 0; i < rows.length; i += 1) {
        const row = rows[i].dataValues;
        if (!projectTypes[row.Project.ProjectType.id]) {
          projectTypes[row.Project.ProjectType.id] = [];
        }
        projectTypes[row.Project.ProjectType.id].push(row);
      }
      // const keys = Object.keys(projectTypes);
      models.ProjectType.findAll({
        where: {},
      }).then((tmpProjectTypes) => {
        for (let i = 0; i < tmpProjectTypes.length; i += 1) {
          const key = tmpProjectTypes[i].id;
          let sumRkapOk = 0;
          let sumRkapOp = 0;
          let sumRkapLk = 0;
          let sumRealisasiOk = 0;
          let sumRealisasiOp = 0;
          let sumRealisasiLk = 0;
          let sumPrognosaOk = 0;
          let sumPrognosaOp = 0;
          let sumPrognosaLk = 0;

          const projectProgresses = projectTypes[key];
          if (projectProgresses) {
            for (let j = 0; j < projectProgresses.length; j += 1) {
              const projectProgress = projectProgresses[j];
              sumRkapOk += projectProgress.rkapOk;
              sumRkapOp += projectProgress.rkapOp;
              sumRkapLk += projectProgress.rkapLk;
              sumRealisasiOk += projectProgress.realisasiOk;
              sumRealisasiOp += projectProgress.realisasiOp;
              sumRealisasiLk += projectProgress.realisasiLk;
              sumPrognosaOk += (projectProgress.month > result.latestRealizationMonth ?
                projectProgress.prognosaOk : projectProgress.realisasiOk);
              sumPrognosaOp += (projectProgress.month > result.latestRealizationMonth ?
                projectProgress.prognosaOp : projectProgress.realisasiOp);
              sumPrognosaLk += (projectProgress.month > result.latestRealizationMonth ?
                projectProgress.prognosaLk : projectProgress.realisasiLk);
            }
          }

          sums.push({
            project_type: key,
            sum_rkap_ok: sumRkapOk,
            sum_rkap_op: sumRkapOp,
            sum_rkap_lk: sumRkapLk,
            sum_realisasi_ok: sumRealisasiOk,
            sum_realisasi_op: sumRealisasiOp,
            sum_realisasi_lk: sumRealisasiLk,
            sum_prognosa_ok: sumPrognosaOk,
            sum_prognosa_op: sumPrognosaOp,
            sum_prognosa_lk: sumPrognosaLk,
          });
        }
        const sortedSums = sums.sort((obj1, obj2) => obj1.project_type - obj2.project_type);
        result.sumProjectProgressLastMonthOfYear = sortedSums;
        callback();
      });
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });

    // var query = "SELECT p.project_type, " +
    //
    // "SUM(rkap_ok) AS sum_rkap_ok, " +
    // "SUM(rkap_op) AS sum_rkap_op, " +
    // "SUM(rkap_lk) AS sum_rkap_lk, " +
    //
    // "SUM(realisasi_ok) AS sum_realisasi_ok, " +
    // "SUM(realisasi_op) AS sum_realisasi_op, " +
    // "SUM(realisasi_lk) AS sum_realisasi_lk, " +
    //
    // "SUM(case when pp.month > ? then prognosa_ok else realisasi_ok end) AS sum_prognosa_ok, " +
    // "SUM(case when pp.month > ? then prognosa_op else realisasi_op end) AS sum_prognosa_op, " +
    // "SUM(case when pp.month > ? then prognosa_lk else realisasi_lk end) AS sum_prognosa_lk " +
    //
    // "FROM project_progress pp " +
    // "LEFT JOIN project p ON pp.project_id = p.id " +
    // // "WHERE pp.month <= ? AND pp.year = ? " +
    // "WHERE pp.month <= 12 AND pp.year = ? " +
    // "GROUP BY p.project_type " +
    // "ORDER BY p.project_type ";
    //
    // db.query(
    //   query, [
    //     result.latestRealizationMonth,
    //     result.latestRealizationMonth,
    //     result.latestRealizationMonth,
    //     year],
    //   function(err, rows) {
    //     if (err) throw callback(err);
    //
    //     result.sumProjectProgressLastMonthOfYear = rows;
    //     callback();
    //   }
    // );
  };

  const getSumProjectProgressInYear = (callback) => {
    models.ProjectProgress.findAll({
      where: { year },
      include: [
        {
          model: models.Project,
          include: [
            {
              model: models.ProjectType,
            },
          ],
        },
      ],
    })
    .then((rows) => {
      if (rows.length > 0) {
        let sumRkapOk = 0;
        let sumRkapOp = 0;
        let sumRkapLk = 0;
        let sumPrognosaOk = 0;
        let sumPrognosaOp = 0;
        let sumPrognosaLk = 0;
        for (let i = 0; i < rows.length; i += 1) {
          const projectProgress = rows[i];
          sumRkapOk += projectProgress.rkapOk;
          sumRkapOp += projectProgress.rkapOp;
          sumRkapLk += projectProgress.rkapLk;
          sumPrognosaOk += (projectProgress.month > result.latestRealizationMonth ?
            projectProgress.prognosaOk : projectProgress.realisasiOk);
          sumPrognosaOp += (((projectProgress.month > result.latestRealizationMonth) || projectProgress.month == 12) ?
            projectProgress.prognosaOp : projectProgress.realisasiOp);
          sumPrognosaLk += (projectProgress.month > result.latestRealizationMonth ?
            projectProgress.prognosaLk : projectProgress.realisasiLk);
        }
        result.sumProjectProgressInYear = {
          sum_rkap_ok: sumRkapOk,
          sum_rkap_op: sumRkapOp,
          sum_rkap_lk: sumRkapLk,
          sum_prognosa_ok: sumPrognosaOk,
          sum_prognosa_op: sumPrognosaOp,
          sum_prognosa_lk: sumPrognosaLk,
        };
      } else {
        result.sumProjectProgressInYear = null;
      }
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });

    // const query = "SELECT " +
    //
    // "SUM(rkap_ok) AS sum_rkap_ok, " +
    // "SUM(rkap_op) AS sum_rkap_op, " +
    // "SUM(rkap_lk) AS sum_rkap_lk, " +
    //
    // "SUM(case when pp.month > ? then prognosa_ok else realisasi_ok end) AS sum_prognosa_ok, " +
    // "SUM(case when pp.month > ? then prognosa_op else realisasi_op end) AS sum_prognosa_op, " +
    // "SUM(case when pp.month > ? then prognosa_lk else realisasi_lk end) AS sum_prognosa_lk " +
    //
    // "FROM project_progress pp " +
    // "LEFT JOIN project p ON pp.project_id = p.id " +
    // "WHERE pp.year = ? ";
    //
    // db.query(
    //   query, [
    //     result.latestRealizationMonth,
    //     result.latestRealizationMonth,
    //     result.latestRealizationMonth,
    //     year],
    //   (err, rows) => {
    //     if (err) callback(err);
    //     if (rows.length > 0) {
    //       result.sumProjectProgressInYear = rows[0];
    //     } else {
    //       result.sumProjectProgressInYear = null;
    //     }
    //     callback();
    //   }
    // );
  };

  const getLspInLastMonthOfYear = (callback) => {
    models.Lsp.findAll({
      where: { month: 12, year },
    }).then((rows) => {
      result.lspInLastMonthOfYear = null;
      if (rows.length > 0) {
        result.lspInLastMonthOfYear = rows[0];
        result.lspInLastMonthOfYear.lsp_rkap = rows[0].lspRkap;
        result.lspInLastMonthOfYear.lsp_realisasi = rows[0].lspRealisasi;
        result.lspInLastMonthOfYear.lsp_prognosa = rows[0].lspPrognosa;
      }
      callback();
    }).catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  const getLspInMonth = (callback) => {
    models.Lsp.findAll({
      where: { month, year },
    }).then((rows) => {
      result.lspInMonth = null;
      if (rows.length > 0) {
        result.lspInMonth = rows[0];
        result.lspInMonth.lsp_realisasi = rows[0].lspRealisasi;
      }
      callback();
    }).catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  const getClaim = (callback) => {
    models.Claim.findAll({
      where: { year },
    }).then((rows) => {
      result.claim = null;
      if (rows.length > 0) {
        result.claim = rows[0];
        result.claim.lsp_realisasi = result.claim.lspRealisasi;
      }
      callback();
    }).catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  Flow.series([
    getLatesRealizationMonth,
    getSumProjectProgressPerMonth,
    getSumProjectProgressLastMonthOfYear,
    getSumProjectProgressInYear,
    getLspInLastMonthOfYear,
    getLspInMonth,
    getClaim,
    () => {
      resultCallback(result);
    },
  ], (err) => {
    console.error('Error while doing operation.');
    throw err;
  });
};
