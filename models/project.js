'use strict';
module.exports = function(sequelize, DataTypes) {
  var Project = sequelize.define('Project', {
    code: DataTypes.STRING,
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  Project.associate = function (models) {
    Project.belongsTo(models.ProjectType, { onDelete: 'restrict' });
  };

  return Project;
};
