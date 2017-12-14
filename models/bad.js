'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bad = sequelize.define('Bad', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    piutangUsaha: DataTypes.FLOAT,
    tagihanBruto: DataTypes.FLOAT,
    piutangRetensi: DataTypes.FLOAT,
    pdp: DataTypes.FLOAT,
    bad: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Bad.associate = function (models) {
    Bad.belongsTo(models.Project, { onDelete: 'restrict' });
  };

  return Bad;
};
