'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Piutangs', {
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
      owner: {
        type: Sequelize.STRING
      },
      pdp1: {
        type: Sequelize.FLOAT
      },
      tagihanBruto1: {
        type: Sequelize.FLOAT
      },
      piutangUsaha1: {
        type: Sequelize.FLOAT
      },
      piutangRetensi1: {
        type: Sequelize.FLOAT
      },
      pdp2: {
        type: Sequelize.FLOAT
      },
      tagihanBruto2: {
        type: Sequelize.FLOAT
      },
      piutangUsaha2: {
        type: Sequelize.FLOAT
      },
      piutangRetensi2: {
        type: Sequelize.FLOAT
      },
      pdp3: {
        type: Sequelize.FLOAT
      },
      tagihanBruto3: {
        type: Sequelize.FLOAT
      },
      piutangUsaha3: {
        type: Sequelize.FLOAT
      },
      piutangRetensi3: {
        type: Sequelize.FLOAT
      },
      pdp4: {
        type: Sequelize.FLOAT
      },
      tagihanBruto4: {
        type: Sequelize.FLOAT
      },
      piutangUsaha4: {
        type: Sequelize.FLOAT
      },
      piutangRetensi4: {
        type: Sequelize.FLOAT
      },
      pdp5: {
        type: Sequelize.FLOAT
      },
      tagihanBruto5: {
        type: Sequelize.FLOAT
      },
      piutangUsaha5: {
        type: Sequelize.FLOAT
      },
      piutangRetensi5: {
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
    return queryInterface.dropTable('Piutangs');
  }
};