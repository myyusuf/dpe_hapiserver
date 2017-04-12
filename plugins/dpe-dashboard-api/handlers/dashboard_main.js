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
  "WHERE pp.month <= ? AND pp.year = ? " +
  "GROUP BY p.project_type ";

  db.query(
    query, [month, year],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT " +

      "SUM(rkap_ok) AS sum_rkap_ok, " +
      "SUM(rkap_op) AS sum_rkap_op, " +
      "SUM(rkap_lk) AS sum_rkap_lk, " +

      "SUM(prognosa_ok) AS sum_prognosa_ok, " +
      "SUM(prognosa_op) AS sum_prognosa_op, " +
      "SUM(prognosa_lk) AS sum_prognosa_lk " +

      "FROM project_progress pp " +
      "LEFT JOIN project p ON pp.project_id = p.id " +
      "WHERE pp.year = ? ";

      db.query(
        query, [year],
        function(err, rows2) {
          if (err) throw err;

          var rkapPrognosa = null;
          if(rows2.length > 0){
            rkapPrognosa = rows2[0];
          }

          var query = "SELECT " +

          "SUM(lsp_rkap) AS sum_lsp_rkap, " +
          "SUM(lsp_prognosa) AS sum_lsp_prognosa, " +
          "SUM(lsp_realisasi) AS sum_lsp_realisasi " +

          "FROM lsp " +
          "WHERE year = ? ";

          db.query(
            query, [year],
            function(err, rows3) {
              if (err) throw err;

              var lsp = null;
              if(rows3.length > 0){
                lsp = rows3[0];
              }
              resultCallback(rows, rkapPrognosa, lsp);
            }
          );

        }
      );

    }
  );

};
