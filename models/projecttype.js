'use strict';
module.exports = function(sequelize, DataTypes) {
  var ProjectType = sequelize.define('ProjectType', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return ProjectType;
};