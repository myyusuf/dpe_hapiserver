const DashboardMain = require('../helpers/dashboard_main');
const DashboardChart = require('../helpers/dashboard_chart');

const MONHTS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Des'];

exports.getDashboardData = (req, res) => {
  const year = req.params.year;
  const month = req.params.month;

  const result = {
    data1: {
      title: 'RKAP',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data2: {
      title: 'Ri',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data3: {
      title: 'Prog',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data4: {
      title: 'Sisa',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data5: {
      title: 'OK Lama',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data6: {
      title: 'OK Baru (Sudah Didapat)',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data7: {
      title: 'OK Baru (Dalam Pengusahaan)',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
    data8: {
      title: 'Lain Lain',
      ok: 0,
      op: 0,
      lsp: 0,
      lk: 0,
    },
  };
  DashboardMain.getMainData(month, year, (mainDataResult) => {
    const totalProyekLamaNonJO = {};
    const totalProyekLamaJO = {};
    const totalProyekBaruDiperolehNonJO = {};
    const totalProyekBaruDiperolehJO = {};
    const totalProyekBaruPengusahaanNonJO = {};
    const totalProyekBaruPengusahaanJO = {};
    const totalProyekBaruPengusahaanIntern = {};

    const fillData = (obj, data) => {
      obj['sum_rkap_ok'] = data.sum_rkap_ok;
      obj['sum_rkap_op'] = data.sum_rkap_op;
      obj['sum_rkap_lk'] = data.sum_rkap_lk;

      obj['sum_realisasi_ok'] = data.sum_realisasi_ok;
      obj['sum_realisasi_op'] = data.sum_realisasi_op;
      obj['sum_realisasi_lk'] = data.sum_realisasi_lk;

      obj['sum_prognosa_ok'] = data.sum_prognosa_ok;
      obj['sum_prognosa_op'] = data.sum_prognosa_op;
      obj['sum_prognosa_lk'] = data.sum_prognosa_lk;
    }

    const initData = {
      sum_rkap_ok: 0,
      sum_rkap_op: 0,
      sum_rkap_lk: 0,

      sum_realisasi_ok: 0,
      sum_realisasi_op: 0,
      sum_realisasi_lk: 0,

      sum_prognosa_ok: 0,
      sum_prognosa_op: 0,
      sum_prognosa_lk: 0,
    };

    fillData(totalProyekLamaNonJO, initData);
    fillData(totalProyekLamaJO, initData);
    fillData(totalProyekBaruDiperolehNonJO, initData);
    fillData(totalProyekBaruDiperolehJO, initData);
    fillData(totalProyekBaruPengusahaanNonJO, initData);
    fillData(totalProyekBaruPengusahaanJO, initData);
    fillData(totalProyekBaruPengusahaanIntern, initData);

    const list = mainDataResult.sumProjectProgressPerMonth;

    for (let i = 0; i < list.length; i += 1) {
      const data = list[i];
      switch (parseInt(data.project_type, 10)) {
        case 1:
          fillData(totalProyekLamaNonJO, data);
          break;
        case 2:
          fillData(totalProyekLamaJO, data);
          break;
        case 3:
          fillData(totalProyekBaruDiperolehNonJO, data);
          break;
        case 4:
          fillData(totalProyekBaruDiperolehJO, data);
          break;
        case 5:
          fillData(totalProyekBaruPengusahaanNonJO, data);
          break;
        case 6:
          fillData(totalProyekBaruPengusahaanJO, data);
          break;
        case 7:
          fillData(totalProyekBaruPengusahaanIntern, data);
          break;
        default:
          break;
      }
    }

    result.data1.ok = mainDataResult.sumProjectProgressInYear.sum_rkap_ok;
    result.data1.op = mainDataResult.sumProjectProgressInYear.sum_rkap_op;
    result.data1.lsp = mainDataResult.lspInLastMonthOfYear ?
    mainDataResult.lspInLastMonthOfYear.lsp_rkap : 0;

    result.data2.ok = totalProyekLamaNonJO.sum_realisasi_ok +
                      totalProyekLamaJO.sum_realisasi_ok +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_ok +
                      totalProyekBaruDiperolehJO.sum_realisasi_ok +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_ok +
                      totalProyekBaruPengusahaanJO.sum_realisasi_ok +
                      totalProyekBaruPengusahaanIntern.sum_realisasi_ok;

    result.data2.op = totalProyekLamaNonJO.sum_realisasi_op +
                      totalProyekLamaJO.sum_realisasi_op +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_op +
                      totalProyekBaruDiperolehJO.sum_realisasi_op +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_op +
                      totalProyekBaruPengusahaanJO.sum_realisasi_op +
                      totalProyekBaruPengusahaanIntern.sum_realisasi_op;

    result.data2.lk = totalProyekLamaNonJO.sum_realisasi_lk +
                      totalProyekLamaJO.sum_realisasi_lk +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_lk +
                      totalProyekBaruDiperolehJO.sum_realisasi_lk +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_lk +
                      totalProyekBaruPengusahaanJO.sum_realisasi_lk +
                      totalProyekBaruPengusahaanIntern.sum_realisasi_lk;

    result.data2.lsp = mainDataResult.lspInMonth ? mainDataResult.lspInMonth.lsp_realisasi : 0;

    result.data3.ok = mainDataResult.sumProjectProgressInYear.sum_prognosa_ok;
    result.data3.op = mainDataResult.sumProjectProgressInYear.sum_prognosa_op;
    result.data3.lsp = mainDataResult.lspInLastMonthOfYear ?
    mainDataResult.lspInLastMonthOfYear.lsp_prognosa : 0;

    result.data4.ok = result.data3.ok - result.data2.ok;
    result.data4.op = result.data3.op - result.data2.op;
    result.data4.lsp = result.data3.lsp - result.data2.lsp;
    // result.data4.ok = mainData.sum_prognosa_ok - mainData.sum_realisasi_ok;
    // result.data4.op = mainData.sum_prognosa_op - mainData.sum_realisasi_op;
    // result.data4.lk = mainData.sum_prognosa_lk - mainData.sum_realisasi_lk;

    const ppLastMonthOfYear = mainDataResult.sumProjectProgressLastMonthOfYear;

    if (ppLastMonthOfYear[0]) {
      result.data5.ok = (ppLastMonthOfYear[0].sum_prognosa_ok + ppLastMonthOfYear[1].sum_prognosa_ok) -
      (totalProyekLamaNonJO.sum_realisasi_ok + totalProyekLamaJO.sum_realisasi_ok);
      result.data5.op = (ppLastMonthOfYear[0].sum_prognosa_op + ppLastMonthOfYear[1].sum_prognosa_op) -
      (totalProyekLamaNonJO.sum_realisasi_op + totalProyekLamaJO.sum_realisasi_op);
      result.data5.lk = (ppLastMonthOfYear[0].sum_prognosa_lk + ppLastMonthOfYear[1].sum_prognosa_lk) -
      (totalProyekLamaNonJO.sum_realisasi_lk + totalProyekLamaJO.sum_realisasi_lk);

      result.data6.ok = (ppLastMonthOfYear[2].sum_prognosa_ok + ppLastMonthOfYear[3].sum_prognosa_ok) -
      (totalProyekBaruDiperolehNonJO.sum_realisasi_ok + totalProyekBaruDiperolehJO.sum_realisasi_ok);
      result.data6.op = (ppLastMonthOfYear[2].sum_prognosa_op + ppLastMonthOfYear[3].sum_prognosa_op) -
      (totalProyekBaruDiperolehNonJO.sum_realisasi_op + totalProyekBaruDiperolehJO.sum_realisasi_op);
      result.data6.lk = (ppLastMonthOfYear[2].sum_prognosa_lk + ppLastMonthOfYear[3].sum_prognosa_lk) -
      (totalProyekBaruDiperolehNonJO.sum_realisasi_lk + totalProyekBaruDiperolehJO.sum_realisasi_lk);

      result.data7.ok = (ppLastMonthOfYear[4].sum_prognosa_ok + ppLastMonthOfYear[5].sum_prognosa_ok) -
      (totalProyekBaruPengusahaanNonJO.sum_realisasi_ok + totalProyekBaruPengusahaanJO.sum_realisasi_ok);
      result.data7.op = (ppLastMonthOfYear[4].sum_prognosa_op + ppLastMonthOfYear[5].sum_prognosa_op) -
      (totalProyekBaruPengusahaanNonJO.sum_realisasi_op + totalProyekBaruPengusahaanJO.sum_realisasi_op);
      result.data7.lk = (ppLastMonthOfYear[4].sum_prognosa_lk + ppLastMonthOfYear[5].sum_prognosa_lk) -
      (totalProyekBaruPengusahaanNonJO.sum_realisasi_lk + totalProyekBaruPengusahaanJO.sum_realisasi_lk);

      if (mainDataResult.claim) {
        result.data8.ok = mainDataResult.claim.ok;
        result.data8.op = mainDataResult.claim.op;
        result.data8.lk = mainDataResult.claim.lk;
      } else {
        result.data8.ok = 0;
        result.data8.op = 0;
        result.data8.lk = 0;
      }

      // TODO Ask
      result.data5.ok = result.data5.ok - result.data8.ok;
      result.data5.op = result.data5.op - result.data8.op;
      result.data5.lk = result.data5.lk - result.data8.lk;
    } else {
      result.data5.ok = 0;
      result.data5.op = 0;
      result.data5.lk = 0;

      result.data6.ok = 0;
      result.data6.op = 0;
      result.data6.lk = 0;

      result.data7.ok = 0;
      result.data7.op = 0;
      result.data7.lk = 0;

      result.data8.ok = 0;
      result.data8.op = 0;
      result.data8.lk = 0;
    }
    res.json(result);
  });
};

exports.allCharts = (req, res) => {
  const year = req.params.year;

  const result = {
    okData: [],
    opData: [],
    lkData: [],
    lspData: [],
  };

  DashboardChart.getChartData(year, (chartDataList) => {
    for (let i = 0; i < chartDataList.length; i += 1) {
      const chartData = chartDataList[i].dataValues;

      const okData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_ok,
        actual: chartData.sum_realisasi_ok,
      };

      const opData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_op,
        actual: chartData.sum_realisasi_op,
      };

      const lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_lk,
        actual: chartData.sum_realisasi_lk,
      };

      result.okData.push(okData);
      result.opData.push(opData);
      result.lkData.push(lkData);
    }

    DashboardChart.getLspChartData(year, (chartDataList2) => {
      for (let i = 0; i < chartDataList2.length; i += 1) {
        const chartData2 = chartDataList2[i];
        const lspData = {
          month: MONHTS[chartData2.month - 1],
          plan: chartData2.lsp_prognosa,
          actual: chartData2.lsp_realisasi,
        };
        result.lspData.push(lspData);
      }
      res.json(result);
    });
  });
};

exports.dashboardOk = (req, res) => {
  const year = req.params.year;

  const result = [];
  DashboardChart.getChartData(year, (chartDataList) => {
    for (let i = 0; i < chartDataList.length; i += 1) {
      const chartData = chartDataList[i];
      const okData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_ok,
        actual: chartData.sum_realisasi_ok,
      };
      result.push(okData);
    }
    res.json(result);
  });
};

exports.dashboardOp = (req, res) => {
  const year = req.params.year;

  const result = [];
  DashboardChart.getChartData(year, (chartDataList) => {
    for (let i = 0; i < chartDataList.length; i += 1) {
      const chartData = chartDataList[i];
      const opData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_op,
        actual: chartData.sum_realisasi_op,
      };
      result.push(opData);
    }
    res.json(result);
  });
};

exports.dashboardLk = (req, res) => {
  const year = req.params.year;

  const result = [];
  DashboardChart.getChartData(year, (chartDataList) => {
    for (let i = 0; i < chartDataList.length; i += 1) {
      const chartData = chartDataList[i];
      const lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_lk,
        actual: chartData.sum_realisasi_lk,
      };
      result.push(lkData);
    }
    res.json(result);
  });
};

exports.dashboardLsp = (req, res) => {
  const year = req.params.year;

  const result = [];
  DashboardChart.getLspChartData(year, (chartDataList) => {
    for (let i = 0; i < chartDataList.length; i += 1) {
      const chartData = chartDataList[i];
      const lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.lsp_prognosa,
        actual: chartData.lsp_realisasi,
      };
      result.push(lkData);
    }
    res.json(result);
  });
};
