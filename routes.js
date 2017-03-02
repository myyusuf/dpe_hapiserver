'use strict';

const ExcelReader = require('./handlers/excelreader');
const Pages = require('./handlers/pages');
const Assets = require('./handlers/assets');
const ProjectProgress = require('./handlers/project_progress');

module.exports = [
  {
    method: 'GET',
    path: '/convert',
    handler: ExcelReader.readExcel
  },
  {
      method: 'GET',
      path: '/',
      handler: Pages.home
  },
  {
      method: 'GET',
      path: '/login',
      handler: Pages.loginView
  },
  {
      method: 'POST',
      path: '/login',
      handler: Pages.login
  },
  {
      method: 'GET',
      path: '/{param*}',
      handler: Assets.servePublicDirectory
  },
  {
      method: 'POST',
      path: '/project_progress/upload',
      handler: ProjectProgress.upload,
      config: {
          payload: {
              parse: true,
              output: 'file'
          }
      }
  }
];
