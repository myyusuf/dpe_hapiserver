'use strict';
module.exports = function(sequelize, DataTypes) {
  var CashFlow = sequelize.define('CashFlow', {
    year: DataTypes.INTEGER,
    rkap: DataTypes.FLOAT,
    rolling: DataTypes.FLOAT,
    typeCode: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return CashFlow;
};