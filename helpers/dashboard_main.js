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
        const maxMonth = rows.reduce(
          (max, obj) => Math.max(max, obj.sum_realisasi_ok),
          rows[0].sum_realisasi_ok);
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
      attributes: [
        'Project.ProjectType.id',
        [sequelize.fn('sum', sequelize.col('rkapOk')), 'sum_rkap_ok'],
        [sequelize.fn('sum', sequelize.col('rkapOp')), 'sum_rkap_op'],
        [sequelize.fn('sum', sequelize.col('rkapLk')), 'sum_rkap_lk'],
        [sequelize.fn('sum', sequelize.col('realisasiOk')), 'sum_realisasi_ok'],
        [sequelize.fn('sum', sequelize.col('realisasiOp')), 'sum_realisasi_op'],
        [sequelize.fn('sum', sequelize.col('realisasiLk')), 'sum_realisasi_lk'],
        [sequelize.fn('sum', sequelize.col('prognosaOk')), 'sum_prognosa_ok'],
        [sequelize.fn('sum', sequelize.col('prognosaOp')), 'sum_prognosa_op'],
        [sequelize.fn('sum', sequelize.col('prognosaLk')), 'sum_prognosa_lk'],
      ],
      group: ['Project.ProjectType.id'],
    })
    .then((rows) => {
      result.sumProjectProgressPerMonth = rows.map((row) => {
        const tmp = row.dataValues;
        tmp['project_type'] = tmp.id;
        return tmp;
      });
      callback();
    })
    .catch((err) => {
      console.error(err);
      callback(err);
    });
  };

  var getSumProjectProgressLastMonthOfYear = function(callback){
    var query = "SELECT p.project_type, " +

    "SUM(rkap_ok) AS sum_rkap_ok, " +
    "SUM(rkap_op) AS sum_rkap_op, " +
    "SUM(rkap_lk) AS sum_rkap_lk, " +

    "SUM(realisasi_ok) AS sum_realisasi_ok, " +
    "SUM(realisasi_op) AS sum_realisasi_op, " +
    "SUM(realisasi_lk) AS sum_realisasi_lk, " +

    "SUM(case when pp.month > ? then prognosa_ok else realisasi_ok end) AS sum_prognosa_ok, " +
    "SUM(case when pp.month > ? then prognosa_op else realisasi_op end) AS sum_prognosa_op, " +
    "SUM(case when pp.month > ? then prognosa_lk else realisasi_lk end) AS sum_prognosa_lk " +

    "FROM project_progress pp " +
    "LEFT JOIN project p ON pp.project_id = p.id " +
    // "WHERE pp.month <= ? AND pp.year = ? " +
    "WHERE pp.month <= 12 AND pp.year = ? " +
    "GROUP BY p.project_type " +
    "ORDER BY p.project_type ";

    db.query(
      query, [
        result.latestRealizationMonth,
        result.latestRealizationMonth,
        result.latestRealizationMonth,
        year],
      function(err, rows) {
        if (err) throw callback(err);

        result.sumProjectProgressLastMonthOfYear = rows;
        callback();
      }
    );
  }

  var getSumProjectProgressInYear = function(callback){

    const query = "SELECT " +

    "SUM(rkap_ok) AS sum_rkap_ok, " +
    "SUM(rkap_op) AS sum_rkap_op, " +
    "SUM(rkap_lk) AS sum_rkap_lk, " +

    "SUM(case when pp.month > ? then prognosa_ok else realisasi_ok end) AS sum_prognosa_ok, " +
    "SUM(case when pp.month > ? then prognosa_op else realisasi_op end) AS sum_prognosa_op, " +
    "SUM(case when pp.month > ? then prognosa_lk else realisasi_lk end) AS sum_prognosa_lk " +

    "FROM project_progress pp " +
    "LEFT JOIN project p ON pp.project_id = p.id " +
    "WHERE pp.year = ? ";

    db.query(
      query, [
        result.latestRealizationMonth,
        result.latestRealizationMonth,
        result.latestRealizationMonth,
        year],
      (err, rows) => {
        if (err) callback(err);
        if (rows.length > 0) {
          result.sumProjectProgressInYear = rows[0];
        } else {
          result.sumProjectProgressInYear = null;
        }
        callback();
      }
    );
  };

  var getLspInLastMonthOfYear = function(callback){
    var query = "SELECT " +
    "lsp_rkap, lsp_prognosa " +
    "FROM lsp " +
    "WHERE month = ? AND year = ? ";

    db.query(
      query, [12, year],
      function(err, rows) {
        if (err) throw callback(err);

        result.lspInLastMonthOfYear = null
        if(rows.length > 0){
          result.lspInLastMonthOfYear = rows[0];
        }
        callback();
      }
    );
  }

  var getLspInMonth = function(callback){
    var query = "SELECT " +
    "lsp_realisasi " +
    "FROM lsp " +
    "WHERE month = ? AND year = ? ";

    db.query(
      query, [month, year],
      function(err, rows) {
        if (err) throw callback(err);

        result.lspInMonth = null
        if(rows.length > 0){
          result.lspInMonth = rows[0];
        }
        callback();
      }
    );
  }

  const getClaim = (callback) => {
    const query = 'SELECT ok, op, lk FROM claim WHERE year = ? ';

    db.query(
      query, [year],
      (err, rows) => {
        if (err) throw callback(err);
        result.claim = null;
        if (rows.length > 0) {
          result.claim = rows[0];
        }
        callback();
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
    function(callback){
      resultCallback(result);
    }
  ], function(err){
    console.log('Error while doing operation.');
    throw err;
  });

};
