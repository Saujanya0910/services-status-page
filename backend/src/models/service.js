const { DataTypes } = require('sequelize');

/**
 * @param {import('sequelize').Sequelize} sequelize 
 */
module.exports = (sequelize) => {
  const Service = sequelize.define('Service', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: 'service_uuid_unique'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Organization',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('operational', 'down', 'degraded', 'partial_outage', 'major_outage'),
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
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
  {
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'    
  }
);

  Service.associate = (models) => {
    Service.belongsTo(models.Organization, { foreignKey: 'organizationId' });
    Service.hasMany(models.Incident, { foreignKey: 'serviceId' });
  };

  return Service;
};