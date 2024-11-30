const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('operational', 'degraded', 'partial_outage', 'major_outage'),
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    organizationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Service.associate = (models) => {
    Service.belongsTo(models.Organization, { foreignKey: 'organizationId' });
    Service.hasMany(models.Incident, { foreignKey: 'serviceId' });
  };

  return Service;
};