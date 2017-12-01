exports.findPiutangData = function findPiutangData(request, reply) {
  const year = request.params.year;
  const month = request.params.month;

  this.db.query(
    'SELECT * FROM piutang WHERE month = ? AND year = ?',
    [month, year],
    (err, rows) => {
      if (err) reply(err);
      reply(rows);
    });
};

exports.findProyeksiData = function findProyeksiData(request, reply) {
  const year = request.params.year;

  this.db.query(
    'SELECT * FROM proyeksi WHERE year = ?',
    [year],
    (err, rows) => {
      if (err) reply(err);
      reply(rows);
    });
};
