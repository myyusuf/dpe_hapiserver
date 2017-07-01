'use strict';

const DashboardMain = require('./dashboard_main');
const DashboardChart = require('./dashboard_chart');

const MONHTS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

exports.getDashboardData = function(request, reply) {

  var year = request.params.year;
  var month = request.params.month;

  var result = {
      data1: {
          title: "RKAP",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data2: {
          title: "Ri",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data3: {
          title: "Prog",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data4: {
          title: "Sisa",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data5: {
          title: "OK Lama",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data6: {
          title: "OK Baru (Sudah Didapat)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data7: {
          title: "OK Baru (Dalam Pengusahaan)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data8: {
          title: "Lain Lain",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      }
  };

  DashboardMain.getMainData(this.db, month, year, function(mainDataResult){

    // console.log(JSON.stringify(mainDataResult));

    // {id: '1', nama: "Proyek Lama Non JO/Non KSO"},
    // {id: '2', nama: "Proyek Lama JO/KSO"},
    // {id: '3', nama: "Proyek Baru Sudah Diperoleh Non JO/Non KSO"},
    // {id: '4', nama: "Proyek Baru Sudah Diperoleh JO/KSO"},
    // {id: '5', nama: "Proyek Baru Dalam Pengusahaan Non JO/Non KSO"},
    // {id: '6', nama: "Proyek Baru Dalam Pengusahaan JO/KSO"},

    var totalProyekLamaNonJO = {};
    var totalProyekLamaJO = {};
    var totalProyekBaruDiperolehNonJO = {};
    var totalProyekBaruDiperolehJO = {};
    var totalProyekBaruPengusahaanNonJO = {};
    var totalProyekBaruPengusahaanJO = {};
    var totalProyekBaruPengusahaanIntern = {};

    var totalProyekLama = {};
    var totalProyekBaru = {};
    var totalProyek = {};

    var fillData = function(obj, data){
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
      sum_prognosa_lk: 0
    };

    fillData(totalProyekLamaNonJO, initData);
    fillData(totalProyekLamaJO, initData);
    fillData(totalProyekBaruDiperolehNonJO, initData);
    fillData(totalProyekBaruDiperolehJO, initData);
    fillData(totalProyekBaruPengusahaanNonJO, initData);
    fillData(totalProyekBaruPengusahaanJO, initData);
    fillData(totalProyekBaruPengusahaanIntern, initData);

    var list = mainDataResult.sumProjectProgressPerMonth;

    for(var i=0; i<list.length; i++){
      var data = list[i];
      switch(data.project_type){
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
      }

    }

    result.data1.ok = mainDataResult.sumProjectProgressInYear.sum_rkap_ok;
    result.data1.op = mainDataResult.sumProjectProgressInYear.sum_rkap_op;
    result.data1.lsp = mainDataResult.lspInLastMonthOfYear ? mainDataResult.lspInLastMonthOfYear.lsp_rkap : 0;

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
    result.data3.lsp = mainDataResult.lspInLastMonthOfYear ? mainDataResult.lspInLastMonthOfYear.lsp_prognosa : 0;

    result.data4.ok = result.data3.ok - result.data2.ok;
    result.data4.op = result.data3.op - result.data2.op;
    result.data4.lsp = result.data3.lsp - result.data2.lsp;
    // result.data4.ok = mainData.sum_prognosa_ok - mainData.sum_realisasi_ok;
    // result.data4.op = mainData.sum_prognosa_op - mainData.sum_realisasi_op;
    // result.data4.lk = mainData.sum_prognosa_lk - mainData.sum_realisasi_lk;

    var ppLastMonthOfYear = mainDataResult.sumProjectProgressLastMonthOfYear;

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
    }



    reply(result);
  });


};


exports.allCharts = function(request, reply) {

  var year = request.params.year;

  var result = {
    okData: [],
    opData: [],
    lkData: [],
    lspData: []
  };

  var db = this.db;

  DashboardChart.getChartData(db, year, function(chartDataList){

    for(var i=0; i<chartDataList.length; i++){
      var chartData = chartDataList[i];

      var okData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_ok,
        actual: chartData.sum_realisasi_ok
      }

      var opData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_op,
        actual: chartData.sum_realisasi_op
      }

      var lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_lk,
        actual: chartData.sum_realisasi_lk
      }

      result.okData.push(okData);
      result.opData.push(opData);
      result.lkData.push(lkData);
      // result.lspData.push(lspData);

    }
    // reply(result);
    DashboardChart.getLspChartData(db, year, function(chartDataList){

      for(var i=0; i<chartDataList.length; i++){
        var chartData = chartDataList[i];
        var lkData = {
          month: MONHTS[chartData.month - 1],
          plan: chartData.lsp_prognosa,
          actual: chartData.lsp_realisasi,
        }
        result.lspData.push(lkData);
      }

      reply(result);
    });

  });

};

exports.dashboardOk = function(request, reply) {

  var year = request.params.year;

  var result = [];
  DashboardChart.getChartData(this.db, year, function(chartDataList){

    for(var i=0; i<chartDataList.length; i++){
      var chartData = chartDataList[i];
      var okData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_ok,
        actual: chartData.sum_realisasi_ok
      }
      result.push(okData);
    }
    reply(result);
  });

};

exports.dashboardOp = function(request, reply) {

  var year = request.params.year;

  var result = [];
  DashboardChart.getChartData(this.db, year, function(chartDataList){

    for(var i=0; i<chartDataList.length; i++){
      var chartData = chartDataList[i];
      var opData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_op,
        actual: chartData.sum_realisasi_op
      }
      result.push(opData);
    }
    reply(result);
  });

};

exports.dashboardLk = function(request, reply) {

  var year = request.params.year;

  var result = [];
  DashboardChart.getChartData(this.db, year, function(chartDataList){

    for(var i=0; i<chartDataList.length; i++){
      var chartData = chartDataList[i];
      var lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.sum_rkap_lk,
        actual: chartData.sum_realisasi_lk
      }
      result.push(lkData);
    }
    reply(result);
  });
};

exports.dashboardLsp = function(request, reply) {

  var year = request.params.year;

  var result = [];
  DashboardChart.getLspChartData(this.db, year, function(chartDataList){

    for(var i=0; i<chartDataList.length; i++){
      var chartData = chartDataList[i];
      var lkData = {
        month: MONHTS[chartData.month - 1],
        plan: chartData.lsp_prognosa,
        actual: chartData.lsp_realisasi,
      }
      result.push(lkData);
    }
    reply(result);
  });

    /*var result = [{
            "month": "Jan",
            "plan": 16.99,
            "actual": 52.727
        },
        {
            "month": "Feb",
            "plan": 336.515,
            "actual": 270.909
        },
        {
            "month": "Mar",
            "plan": 1650.662,
            "actual": 1614.947
        },
        {
            "month": "Apr",
            "plan": 1893.504,
            "actual": 2087.302
        },
        {
            "month": "Mei",
            "plan": 1913.385,
            "actual": 2315.823
        },
        {
            "month": "Jun",
            "plan": 1932.368,
            "actual": 2417.732
        },
        {
            "month": "Jul",
            "plan": 2251.404,
            "actual": 2417.732
        },
        {
            "month": "Ags",
            "plan": 2447.976,
            "actual": 3180.081
        },
        {
            "month": "Sep",
            "plan": 2469.952,
            "actual": 3193.046
        },
        {
            "month": "Okt",
            "plan": 2515.469,
            "actual": 3200.158
        },
        {
            "month": "Nov",
            "plan": 2547.981,
            "actual": 3567.663
        },
        {
            "month": "Des",
            "plan": 2600,
            "actual": null
        }
    ]

    reply(result);
    */
};
