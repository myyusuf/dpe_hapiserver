'use strict';

exports.getMainData = function(db, month, year, resultCallback) {

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
  "GROUP BY p.project_type "
  "WHERE pp.month <= ? AND pp.year = ? ";
  var ok = 0;

  db.query(
    query, [month, year],
    function(err, rows) {
      if (err) throw err;
      resultCallback(rows);
    }
  );

};
