'use strict';

const DashboardMain = require('./dashboard_main');
const DashboardChart = require('./dashboard_chart');

const MONHTS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];

exports.getDashboardData = function(request, reply) {

  var month = 2;
  var year = 2017;

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
          title: "OK Lama (A)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data6: {
          title: "OK Baru (B1)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data7: {
          title: "OK Baru (B2)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data8: {
          title: "Claim (C)",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      }
  };

  DashboardMain.getMainData(this.db, month, year, function(list){

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
      }

    }

    result.data1.ok = totalProyekLamaNonJO.sum_rkap_ok +
                      totalProyekLamaJO.sum_rkap_ok +
                      totalProyekBaruDiperolehNonJO.sum_rkap_ok +
                      totalProyekBaruDiperolehJO.sum_rkap_ok +
                      totalProyekBaruPengusahaanNonJO.sum_rkap_ok +
                      totalProyekBaruPengusahaanJO.sum_rkap_ok;

    result.data1.op = totalProyekLamaNonJO.sum_rkap_op +
                      totalProyekLamaJO.sum_rkap_op +
                      totalProyekBaruDiperolehNonJO.sum_rkap_op +
                      totalProyekBaruDiperolehJO.sum_rkap_op +
                      totalProyekBaruPengusahaanNonJO.sum_rkap_op +
                      totalProyekBaruPengusahaanJO.sum_rkap_op;

    result.data1.lk = totalProyekLamaNonJO.sum_rkap_lk +
                      totalProyekLamaJO.sum_rkap_lk +
                      totalProyekBaruDiperolehNonJO.sum_rkap_lk +
                      totalProyekBaruDiperolehJO.sum_rkap_lk +
                      totalProyekBaruPengusahaanNonJO.sum_rkap_lk +
                      totalProyekBaruPengusahaanJO.sum_rkap_lk;

    result.data2.ok = totalProyekLamaNonJO.sum_realisasi_ok +
                      totalProyekLamaJO.sum_realisasi_ok +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_ok +
                      totalProyekBaruDiperolehJO.sum_realisasi_ok +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_ok +
                      totalProyekBaruPengusahaanJO.sum_realisasi_ok;

    result.data2.op = totalProyekLamaNonJO.sum_realisasi_op +
                      totalProyekLamaJO.sum_realisasi_op +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_op +
                      totalProyekBaruDiperolehJO.sum_realisasi_op +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_op +
                      totalProyekBaruPengusahaanJO.sum_realisasi_op;

    result.data2.lk = totalProyekLamaNonJO.sum_realisasi_lk +
                      totalProyekLamaJO.sum_realisasi_lk +
                      totalProyekBaruDiperolehNonJO.sum_realisasi_lk +
                      totalProyekBaruDiperolehJO.sum_realisasi_lk +
                      totalProyekBaruPengusahaanNonJO.sum_realisasi_lk +
                      totalProyekBaruPengusahaanJO.sum_realisasi_lk;


    result.data3.ok = totalProyekLamaNonJO.sum_prognosa_ok +
                      totalProyekLamaJO.sum_prognosa_ok +
                      totalProyekBaruDiperolehNonJO.sum_prognosa_ok +
                      totalProyekBaruDiperolehJO.sum_prognosa_ok +
                      totalProyekBaruPengusahaanNonJO.sum_prognosa_ok +
                      totalProyekBaruPengusahaanJO.sum_prognosa_ok;

    result.data3.op = totalProyekLamaNonJO.sum_prognosa_op +
                      totalProyekLamaJO.sum_prognosa_op +
                      totalProyekBaruDiperolehNonJO.sum_prognosa_op +
                      totalProyekBaruDiperolehJO.sum_prognosa_op +
                      totalProyekBaruPengusahaanNonJO.sum_prognosa_op +
                      totalProyekBaruPengusahaanJO.sum_prognosa_op;

    result.data3.lk = totalProyekLamaNonJO.sum_prognosa_lk +
                      totalProyekLamaJO.sum_prognosa_lk +
                      totalProyekBaruDiperolehNonJO.sum_prognosa_lk +
                      totalProyekBaruDiperolehJO.sum_prognosa_lk +
                      totalProyekBaruPengusahaanNonJO.sum_prognosa_lk +
                      totalProyekBaruPengusahaanJO.sum_prognosa_lk;

    result.data4.ok = result.data3.ok - result.data2.ok;
    result.data4.op = result.data3.op - result.data2.op;
    result.data4.lk = result.data3.lk - result.data2.lk;
    // result.data4.ok = mainData.sum_prognosa_ok - mainData.sum_realisasi_ok;
    // result.data4.op = mainData.sum_prognosa_op - mainData.sum_realisasi_op;
    // result.data4.lk = mainData.sum_prognosa_lk - mainData.sum_realisasi_lk;

    result.data5.ok = (totalProyekLamaNonJO.sum_rkap_ok + totalProyekLamaJO.sum_rkap_ok) -
    (totalProyekLamaNonJO.sum_realisasi_ok + totalProyekLamaJO.sum_realisasi_ok);
    result.data5.op = (totalProyekLamaNonJO.sum_rkap_op + totalProyekLamaJO.sum_rkap_op) -
    (totalProyekLamaNonJO.sum_realisasi_op + totalProyekLamaJO.sum_realisasi_op);
    result.data5.lk = (totalProyekLamaNonJO.sum_rkap_lk + totalProyekLamaJO.sum_rkap_lk) -
    (totalProyekLamaNonJO.sum_realisasi_lk + totalProyekLamaJO.sum_realisasi_lk);

    result.data6.ok = (totalProyekBaruDiperolehNonJO.sum_rkap_ok + totalProyekBaruDiperolehJO.sum_rkap_ok) -
    (totalProyekBaruDiperolehNonJO.sum_realisasi_ok + totalProyekBaruDiperolehJO.sum_realisasi_ok);
    result.data6.op = (totalProyekBaruDiperolehNonJO.sum_rkap_op + totalProyekBaruDiperolehJO.sum_rkap_op) -
    (totalProyekBaruDiperolehNonJO.sum_realisasi_op + totalProyekBaruDiperolehJO.sum_realisasi_op);
    result.data6.lk = (totalProyekBaruDiperolehNonJO.sum_rkap_lk + totalProyekBaruDiperolehJO.sum_rkap_lk) -
    (totalProyekBaruDiperolehNonJO.sum_realisasi_lk + totalProyekBaruDiperolehJO.sum_realisasi_lk);

    result.data7.ok = (totalProyekBaruPengusahaanNonJO.sum_rkap_ok + totalProyekBaruPengusahaanJO.sum_rkap_ok) -
    (totalProyekBaruPengusahaanNonJO.sum_realisasi_ok + totalProyekBaruPengusahaanJO.sum_realisasi_ok);
    result.data7.op = (totalProyekBaruPengusahaanNonJO.sum_rkap_op + totalProyekBaruPengusahaanJO.sum_rkap_op) -
    (totalProyekBaruPengusahaanNonJO.sum_realisasi_op + totalProyekBaruPengusahaanJO.sum_realisasi_op);
    result.data7.lk = (totalProyekBaruPengusahaanNonJO.sum_rkap_lk + totalProyekBaruPengusahaanJO.sum_rkap_lk) -
    (totalProyekBaruPengusahaanNonJO.sum_realisasi_lk + totalProyekBaruPengusahaanJO.sum_realisasi_lk);

    reply(result);
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

    var result = [{
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
};
