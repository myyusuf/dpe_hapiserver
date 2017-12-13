'use strict';
module.exports = function(sequelize, DataTypes) {
  var CashFlowItem = sequelize.define('CashFlowItem', {
    month: DataTypes.INTEGER,
    ra: DataTypes.FLOAT,
    prog: DataTypes.FLOAT,
    ri: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  CashFlowItem.associate = function (models) {
    CashFlowItem.belongsTo(models.CashFlow, { onDelete: 'restrict' });
  };

  return CashFlowItem;
};
