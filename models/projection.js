'use strict';
module.exports = function(sequelize, DataTypes) {
  var Projection = sequelize.define('Projection', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    pdp: DataTypes.FLOAT,
    tagihanBruto: DataTypes.FLOAT,
    piutangUsaha: DataTypes.FLOAT,
    piutangRetensi: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Projection;
};