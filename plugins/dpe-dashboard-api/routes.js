'use strict';

const Actions = require('./handlers/actions');
const Project = require('./handlers/project');
const ProjectProgress = require('./handlers/project_progress');
const Dashboard = require('./handlers/dashboard');
const DashboardPiutang = require('./handlers/dashboard_piutang');

module.exports = [
  {
    method: 'POST',
    path: '/api/login',
    config: {
        payload: {
            output: 'data',
            parse: true
        }
    },
    handler: Actions.login
  },
  {
    method: 'GET',
    path: '/api/dashboard/{year}/{month}',
    config: {
        auth: {
          strategy: 'api'
        }
    },
    handler: Dashboard.getDashboardData
  },
  {
    method: 'GET',
    path: '/api/dashboard/charts/{year}',
    handler: Dashboard.allCharts,
    config: {
        auth: {
          strategy: 'api'
        }
    }
  },
  {
    method: 'GET',
    path: '/api/dashboard/ok/{year}',
    handler: Dashboard.dashboardOk
  },
  {
    method: 'GET',
    path: '/api/dashboard/op/{year}',
    handler: Dashboard.dashboardOp
  },
  {
    method: 'GET',
    path: '/api/dashboard/lk/{year}',
    handler: Dashboard.dashboardLk
  },
  {
    method: 'GET',
    path: '/api/dashboard/lsp/{year}',
    handler: Dashboard.dashboardLsp
  },
  {
      method: 'POST',
      path: '/api/projects',
      handler: Project.create
  },
  {
      method: 'GET',
      path: '/api/projects',
      handler: Project.find,
      config: {
          auth: {
            strategy: 'api',
            scope: ['admin']
          }
      }
  },
  {
      method: 'PUT',
      path: '/api/projects/{code}',
      handler: Project.update
  },
  {
      method: 'DELETE',
      path: '/api/projects/{code}',
      handler: Project.delete
  },
  {
      method: 'GET',
      path: '/api/project_progress',
      handler: ProjectProgress.find
  },
  {
    method: 'GET',
    path: '/api/piutang/piutang/{year}/{month}',
    handler: DashboardPiutang.findPiutangData
  },
  {
    method: 'GET',
    path: '/api/piutang/proyeksi/{year}/{month}',
    handler: DashboardPiutang.findProyeksiData
  },
];
