'use strict';

const ExcelReader = require('./handlers/excelreader');
const Pages = require('./handlers/pages');
const Actions = require('./handlers/actions');
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
    path: '/convert2',
    handler: ExcelReader.readExcel2
  },
  {
      method: 'GET',
      path: '/',
      handler: Pages.home,
      config: {
          auth: {
              mode: 'try'
          }
        }
  },
  {
      method: 'GET',
      path: '/projects',
      handler: Pages.projects,
      // config: {
      //     auth: {
      //         mode: 'try'
      //     }
      //   }
  },
  {
      method: 'GET',
      path: '/login',
      handler: Pages.login
  },
  {
      method: 'POST',
      path: '/login',
      handler: Actions.login
  },
  {
      method: 'GET',
      path: '/logout',
      handler: Actions.logout
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
  },
  {
      method: 'GET',
      path: '/hello',
      handler: function(request, reply){
        reply({result: 'hello'});
      },
      config: {
          auth: {
            strategy: 'session',
            scope: ['adminweb']
          }
      }
  }
];
