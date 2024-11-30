const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Incident = sequelize.define('Incident', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('investigating', 'identified', 'monitoring', 'resolved'),
      allowNull: false,
    },
    severity: {
      type: DataTypes.ENUM('minor', 'major', 'critical'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  Incident.associate = (models) => {
    Incident.belongsTo(models.Service, { foreignKey: 'serviceId' });
    Incident.hasMany(models.IncidentUpdate, { foreignKey: 'incidentId' });
  };

  return Incident;
};