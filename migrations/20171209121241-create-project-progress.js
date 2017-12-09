'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('ProjectProgresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      month: {
        type: Sequelize.INTEGER
      },
      year: {
        type: Sequelize.INTEGER
      },
      prognosaLk: {
        type: Sequelize.FLOAT
      },
      prognosaOk: {
        type: Sequelize.FLOAT
      },
      prognosaOp: {
        type: Sequelize.FLOAT
      },
      realisasiLk: {
        type: Sequelize.FLOAT
      },
      realisasiOk: {
        type: Sequelize.FLOAT
      },
      realisasiOp: {
        type: Sequelize.FLOAT
      },
      rkapLk: {
        type: Sequelize.FLOAT
      },
      rkapOk: {
        type: Sequelize.FLOAT
      },
      rkapOp: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('ProjectProgresses');
  }
};