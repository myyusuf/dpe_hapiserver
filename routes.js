'use strict';

const ExcelReader = require('./handlers/excelreader');
const Dashboard = require('./handlers/dashboard');
const Pages = require('./handlers/pages');
const Assets = require('./handlers/assets');

const Project = require('./handlers/project');
const ProjectProgress = require('./handlers/project_progress');

module.exports = [
  {
    method: 'GET',
    path: '/convert',
    handler: ExcelReader.readExcel
  },
  {
    method: 'GET',
    path: '/dashboard',
    config: {
        auth: 'simple',
    },
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
      method: 'GET',
      path: '/',
      handler: Pages.home
  },
  {
      method: 'GET',
      path: '/{param*}',
      handler: Assets.servePublicDirectory
  },
  {
      method: 'POST',
      path: '/api/projects',
      handler: Project.create
  },
  {
      method: 'GET',
      path: '/api/projects',
      handler: Project.find
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
      method: 'POST',
      path: '/api/project_progress/upload',
      handler: ProjectProgress.upload,
      config: {
          payload: {
              parse: true,
              output: 'file'
          }
      }
  }
];
