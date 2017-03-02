const mysql = require('mysql');

const ConfigDB = require('./config/database.js');
const Project = require('./handlers/project');
const ProjectProgress = require('./handlers/project_progress');
const Dashboard = require('./handlers/dashboard');


//Mysql
const db = mysql.createConnection(ConfigDB.mysqlConnectionData);

exports.register = function (server, options, next) {

    server.bind({ db: db });

    server.route([
      {
        method: 'GET',
        path: '/testapi',
        handler: function (request, reply) {

            reply({result: 'api ok'});
        }
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
      }
    ]);

    next();
};

exports.register.attributes = {
    pkg: require('./package')
};
