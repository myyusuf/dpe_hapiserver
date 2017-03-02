'use strict';

const Actions = require('./handlers/actions');
const Project = require('./handlers/project');
const ProjectProgress = require('./handlers/project_progress');
const Dashboard = require('./handlers/dashboard');

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
    path: '/api/dashboard',
    // config: {
    //     auth: 'simple',
    // },
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
          auth: 'api'
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
  }
];
