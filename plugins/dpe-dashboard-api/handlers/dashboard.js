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
          title: "RKAP",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data6: {
          title: "RKAP",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data: {
          title: "RKAP",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      },
      data8: {
          title: "RKAP",
          ok: 0,
          op: 0,
          lsp: 0,
          lk: 0
      }
  };

  DashboardMain.getMainData(this.db, month, year, function(mainData){
    result.data1.ok = mainData.sum_rkap_ok;
    result.data1.op = mainData.sum_rkap_op;
    result.data1.lk = mainData.sum_rkap_lk;

    result.data2.ok = mainData.sum_realisasi_ok;
    result.data2.op = mainData.sum_realisasi_op;
    result.data2.lk = mainData.sum_realisasi_lk;

    result.data3.ok = mainData.sum_prognosa_ok;
    result.data3.op = mainData.sum_prognosa_op;
    result.data3.lk = mainData.sum_prognosa_lk;

    result.data4.ok = mainData.sum_prognosa_ok - mainData.sum_realisasi_ok;
    result.data4.op = mainData.sum_prognosa_op - mainData.sum_realisasi_op;
    result.data4.lk = mainData.sum_prognosa_lk - mainData.sum_realisasi_lk;
    reply(result);
  });


};

exports.dashboardOk = function(request, reply) {

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

    // reply(result);

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

exports.dashboardLk = function(request, reply) {

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
