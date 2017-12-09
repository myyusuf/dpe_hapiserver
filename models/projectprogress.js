'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectProgress = sequelize.define('ProjectProgress', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    prognosaLk: DataTypes.FLOAT,
    prognosaOk: DataTypes.FLOAT,
    prognosaOp: DataTypes.FLOAT,
    realisasiLk: DataTypes.FLOAT,
    realisasiOk: DataTypes.FLOAT,
    realisasiOp: DataTypes.FLOAT,
    rkapLk: DataTypes.FLOAT,
    rkapOk: DataTypes.FLOAT,
    rkapOp: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProjectProgress;
};