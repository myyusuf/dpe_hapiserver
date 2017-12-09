'use strict';
module.exports = function(sequelize, DataTypes) {
  var Claim = sequelize.define('Claim', {
    year: DataTypes.INTEGER,
    ok: DataTypes.FLOAT,
    op: DataTypes.FLOAT,
    lk: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Claim;
};