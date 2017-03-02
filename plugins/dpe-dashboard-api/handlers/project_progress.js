exports.find = function(request, reply) {

  var db = this.db;

  var query = "SELECT pp.*, p.code AS project_code FROM project_progress pp " +
  "LEFT JOIN project p ON pp.project_id = p.id "
  "WHERE (p.code LIKE ? or p.name LIKE ?) " +
  "ORDER BY p.code LIMIT ?,? ";
  var pagesize = parseInt(request.query.pagesize);
  var pagenum = parseInt(request.query.pagenum);
  var code = request.query.searchTxt + '%';
  var name = '%' + request.query.searchTxt + '%';

  db.query(
    query, [code, name, pagenum * pagesize, pagesize],
    function(err, rows) {
      if (err) throw err;

      var query = "SELECT count(1) as totalRecords FROM project_progress pp " +
      "LEFT JOIN project p ON pp.project_id = p.id "
      "WHERE (p.code LIKE ? or p.name LIKE ?) ";
      db.query(
        query, [code, name],
        function(err, rows2) {
          if (err) throw err;

          var totalRecords = rows2[0].totalRecords;
          reply({data: rows, totalRecords: totalRecords});
        }
      );
    }
  );
};
