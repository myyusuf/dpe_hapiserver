'use strict';

exports.getChartData = function(db, year, resultCallback) {

  var query = "SELECT month, " +

  "SUM(rkap_ok) AS sum_rkap_ok, " +
  "SUM(rkap_op) AS sum_rkap_op, " +
  "SUM(rkap_lk) AS sum_rkap_lk, " +

  "SUM(realisasi_ok) AS sum_realisasi_ok, " +
  "SUM(realisasi_op) AS sum_realisasi_op, " +
  "SUM(realisasi_lk) AS sum_realisasi_lk, " +

  "SUM(prognosa_ok) AS sum_prognosa_ok, " +
  "SUM(prognosa_op) AS sum_prognosa_op, " +
  "SUM(prognosa_lk) AS sum_prognosa_lk " +

  "FROM project_progress WHERE year = ? GROUP BY month ";
  var ok = 0;

  db.query(
    query, [year],
    function(err, rows) {
      if (err) throw err;
      resultCallback(rows);
    }
  );

};

exports.getLspChartData = function(db, year, resultCallback) {

  console.log(`year : ${year}`);

  var query = "SELECT month, " +

  "lsp_rkap, " +
  "lsp_prognosa, " +
  "lsp_realisasi " +

  "FROM lsp WHERE year = ? ";
  var ok = 0;

  db.query(
    query, [year],
    function(err, rows) {
      if (err) throw err;
      resultCallback(rows);
    }
  );

};
