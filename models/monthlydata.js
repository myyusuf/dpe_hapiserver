'use strict';
module.exports = function(sequelize, DataTypes) {
  var MonthlyData = sequelize.define('MonthlyData', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    labaSetelahPajak: DataTypes.FLOAT,
    labaRugiLain: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return MonthlyData;
};