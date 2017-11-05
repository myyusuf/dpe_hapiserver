'use strict';

const Flow = require('nimble');

exports.getMainData = function(db, month, year, resultCallback) {

  const result = {
  };

  const getLatesRealizationMonth = (callback) => {
    const query =
    `SELECT MAX(month) AS maxMonth FROM (SELECT
      pp.month AS month, SUM(realisasi_ok) AS sum_realisasi_ok
      FROM project_progress pp
      WHERE pp.year = ? AND pp.realisasi_ok > 0
      GROUP BY pp.month) AS a_table
    `;

    db.query(
      query, [year],
      (err, rows) => {
        if (err) callback(err);

        if (rows.length > 0) {
          result.latestRealizationMonth = rows[0].maxMonth;
        } else {
          result.latestRealizationMonth = 1;
        }
        callback();
      }
    );
  };

  var getSumProjectProgressPerMonth = function(callback){
    var query = "SELECT p.project_type, " +

    "SUM(rkap_ok) AS sum_rkap_ok, " +
    "SUM(rkap_op) AS sum_rkap_op, " +
    "SUM(rkap_lk) AS sum_rkap_lk, " +

    "SUM(realisasi_ok) AS sum_realisasi_ok, " +
    "SUM(realisasi_op) AS sum_realisasi_op, " +
    "SUM(realisasi_lk) AS sum_realisasi_lk, " +

    "SUM(prognosa_ok) AS sum_prognosa_ok, " +
    "SUM(prognosa_op) AS sum_prognosa_op, " +
    "SUM(prognosa_lk) AS sum_prognosa_lk " +

    "FROM project_progress pp " +
    "LEFT JOIN project p ON pp.project_id = p.id " +
    "WHERE pp.month <= ? AND pp.year = ? " +
    "GROUP BY p.project_type ";

    db.query(
      query, [month, year],
      function(err, rows) {
        if (err) throw callback(err);

        result.sumProjectProgressPerMonth = rows;
        callback();
      }
    );
  }

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

  // var getSumLspInYear = function(callback){
  //   var query = "SELECT " +
  //
  //   "SUM(lsp_rkap) AS sum_lsp_rkap, " +
  //   "SUM(lsp_prognosa) AS sum_lsp_prognosa, " +
  //   "SUM(lsp_realisasi) AS sum_lsp_realisasi " +
  //
  //   "FROM lsp " +
  //   "WHERE year = ? ";
  //
  //   db.query(
  //     query, [year],
  //     function(err, rows) {
  //       if (err) throw callback(err);
  //
  //       result.sumLspInYear = null
  //       if(rows.length > 0){
  //         result.sumLspInYear = rows[0];
  //       }
  //       callback();
  //     }
  //   );
  // }

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

  Flow.series([
    getLatesRealizationMonth,
    getSumProjectProgressPerMonth,
    getSumProjectProgressLastMonthOfYear,
    getSumProjectProgressInYear,
    getLspInLastMonthOfYear,
    getLspInMonth,
    function(callback){
      resultCallback(result);
    }
  ], function(err){
    console.log('Error while doing operation.');
    throw err;
  });

};
