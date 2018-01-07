const sequelize = require('sequelize');
const models = require('../models');

exports.getChartData = (year, resultCallback) => {
  models.ProjectProgress.findAll({
    where: { year },
    attributes: [
      'month',
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
    group: ['month'],
  })
  .then((result) => {
    const projectProgresses = result;
    resultCallback(projectProgresses.sort((a, b) => a.month - b.month));
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });
};

exports.getLspChartData = (year, resultCallback) => {
  models.Lsp.findAll({
    where: { year },
    raw: true,
  })
  .then((result) => {
    const convertedResult = result.map(obj => ({
      month: obj.month,
      lsp_rkap: obj.lspRkap,
      lsp_prognosa: obj.lspPrognosa,
      lsp_realisasi: obj.lspRealisasi,
    }));
    resultCallback(convertedResult);
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });
};
