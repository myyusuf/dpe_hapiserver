'use strict';
module.exports = function(sequelize, DataTypes) {
  var Lsp = sequelize.define('Lsp', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    lspRkap: DataTypes.FLOAT,
    lspPrognosa: DataTypes.FLOAT,
    lspRealisasi: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Lsp;
};