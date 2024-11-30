const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const IncidentUpdate = sequelize.define('IncidentUpdate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('investigating', 'identified', 'monitoring', 'resolved'),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    incidentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  IncidentUpdate.associate = (models) => {
    IncidentUpdate.belongsTo(models.Incident, { foreignKey: 'incidentId' });
  };

  return IncidentUpdate;
};