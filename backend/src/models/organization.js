const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Organization = sequelize.define('Organization', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  Organization.associate = (models) => {
    Organization.hasMany(models.User, { foreignKey: 'organizationId' });
    Organization.hasMany(models.Service, { foreignKey: 'organizationId' });
  };

  return Organization;
};