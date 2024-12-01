const { Incident, Organization, Service } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all incidents of an organization by name or UUID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getIncidentsByOrg = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization identifier is required' });
    }

    const organization = await Organization.findOne({
      where: {
        [Op.or]: [
          { uuid: orgIdentifier },
          { name: orgIdentifier }
        ]
      },
      include: {
        model: Service,
        attributes: { exclude: ['createdAt', 'updatedAt', 'organizationId'] },
        where: { isActive: true },
        required: false
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }
    const serviceIds = (organization.Services || []).map(service => service.id).filter(Boolean);
    if(!(serviceIds || []).length) {
      return res.status(404).json([]);
    }
    const incidents = await Incident.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt', 'serviceId'] },
      where: {
        serviceId: {
          [Op.in]: serviceIds
        }
      },
      include: {
        model: Service,
        attributes: ['uuid', 'name']
      },
    });

    return res.status(incidents.length ? 200 : 404).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getIncidentsByOrg
};
