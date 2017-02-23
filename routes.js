'use strict';

const ExcelReader = require('./handlers/excelreader');
const Dashboard = require('./handlers/dashboard');

module.exports = [
  {
    method: 'GET',
    path: '/convert',
    handler: ExcelReader.readExcel
  },
  {
    method: 'GET',
    path: '/dashboard',
    handler: Dashboard.getDashboardData
  },
  {
    method: 'GET',
    path: '/dashboard/ok/{year}',
    handler: Dashboard.dashboardOk
  },
  {
    method: 'GET',
    path: '/dashboard/op/{year}',
    handler: Dashboard.dashboardOp
  },
  {
    method: 'GET',
    path: '/dashboard/lk/{year}',
    handler: Dashboard.dashboardLk
  },
  {
    method: 'GET',
    path: '/dashboard/lsp/{year}',
    handler: Dashboard.dashboardLsp
  }
];
