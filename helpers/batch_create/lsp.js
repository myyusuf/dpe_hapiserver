const models = require('../../models');

const insertToDb = labaSetelahPajakArray => (
  new Promise((resolve, reject) => {
    for (let i = 0; i < labaSetelahPajakArray.length; i += 1) {
      const lsp = labaSetelahPajakArray[i];
      models.Lsp.create({
        year: lsp.year,
        month: lsp.month,
        lspRkap: lsp.lsp_rkap,
        lspPrognosa: lsp.lsp_prognosa,
        lspRealisasi: lsp.lsp_realisasi,
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
    }
  })
);

exports.process = batchData => (
  new Promise((resolve, reject) => {
    const YEAR = batchData.year;
    const labaSetelahPajak = batchData.labaSetelahPajak;
    models.Lsp.destroy(
      {
        where: { year: YEAR },
      })
    .then(() => {
      insertToDb(labaSetelahPajak)
      .then(() => {
        resolve({
          result: 'OK',
        });
      });
    })
    .catch((err) => {
      reject(err);
    });
  })
);
