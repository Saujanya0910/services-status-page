const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  const IncidentUpdate = sequelize.define('IncidentUpdate', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: 'incidentupdate_uuid_unique'
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('investigating', 'identified', 'monitoring', 'resolved'),
      allowNull: false,
    },
    incidentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Incident',
        key: 'id'
      }
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
  },
  {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'    
  }
);

  IncidentUpdate.associate = (models) => {
    IncidentUpdate.belongsTo(models.Incident, { foreignKey: 'incidentId' });
  };

  return IncidentUpdate;
};