'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Bads', {
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
      piutangUsaha: {
        type: Sequelize.FLOAT
      },
      tagihanBruto: {
        type: Sequelize.FLOAT
      },
      piutangRetensi: {
        type: Sequelize.FLOAT
      },
      pdp: {
        type: Sequelize.FLOAT
      },
      bad: {
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
    return queryInterface.dropTable('Bads');
  }
};