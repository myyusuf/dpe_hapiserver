const models = require('../../models');

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const year = batchData.year;
    const payload = batchData.payload;
    models.Claim.destroy({
      where: { year },
    })
    .then(() => {
      models.Claim.create({
        year,
        ok: payload.ok,
        op: payload.op,
        lk: payload.lk,
      })
      .then(() => {
        resolve({
          status: 'OK',
        });
      })
      .catch((errCreate) => {
        reject(errCreate);
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
