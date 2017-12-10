'use strict';
module.exports = function(sequelize, DataTypes) {
  var Piutang = sequelize.define('Piutang', {
    month: DataTypes.INTEGER,
    year: DataTypes.INTEGER,
    owner: DataTypes.STRING,
    pdp1: DataTypes.FLOAT,
    tagihanBruto1: DataTypes.FLOAT,
    piutangUsaha1: DataTypes.FLOAT,
    piutangRetensi1: DataTypes.FLOAT,
    pdp2: DataTypes.FLOAT,
    tagihanBruto2: DataTypes.FLOAT,
    piutangUsaha2: DataTypes.FLOAT,
    piutangRetensi2: DataTypes.FLOAT,
    pdp3: DataTypes.FLOAT,
    tagihanBruto3: DataTypes.FLOAT,
    piutangUsaha3: DataTypes.FLOAT,
    piutangRetensi3: DataTypes.FLOAT,
    pdp4: DataTypes.FLOAT,
    tagihanBruto4: DataTypes.FLOAT,
    piutangUsaha4: DataTypes.FLOAT,
    piutangRetensi4: DataTypes.FLOAT,
    pdp5: DataTypes.FLOAT,
    tagihanBruto5: DataTypes.FLOAT,
    piutangUsaha5: DataTypes.FLOAT,
    piutangRetensi5: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Piutang.associate = function (models) {
    Piutang.belongsTo(models.Project, { onDelete: 'restrict' });
  };

  return Piutang;
};
