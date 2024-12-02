const { Incident, Organization, Service, IncidentUpdate } = require('../models');
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
      attributes: { exclude: ['id', 'createdBy', 'createdAt', 'updatedAt', 'organizationId'] },

      include: {
        model: Service,
        attributes: { exclude: ['createdAt', 'createdBy', 'organizationId'] },
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
      attributes: { exclude: ['id', 'createdBy', 'serviceId'] },
      where: {
        serviceId: {
          [Op.in]: serviceIds
        }
      },
      include: [
        {
          model: Service,
          attributes: ['uuid', 'name']
        },
        {
          model: IncidentUpdate,
          attributes: { exclude: ['id', 'incidentId', 'createdBy'] },
          order: [['createdAt', 'DESC']]
        }
      ]
    });

    return res.status(incidents.length ? 200 : 404).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const createIncident = async (req, res) => {
  try {
    const { incidentIdentifier } = req.params;
    const { title, description } = req.body;

    if (!incidentIdentifier) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const service = await Service.findOne({ where: { uuid: incidentIdentifier } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const incident = await Incident.create({ title, description, serviceId: service.id });
    return res.status(201).json({ uuid: incident.uuid, title, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateIncident = async (req, res) => {
  try {
    const { incidentIdentifier } = req.params;
    const { title, description, status } = req.body;

    if (!incidentIdentifier) {
      return res.status(400).json({ error: 'Incident ID are required' });
    }

    const incident = await Incident.findOne({ where: { uuid: incidentIdentifier } });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    await incident.update({ title, description, status });
    return res.json(incident);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteIncident = async (req, res) => {
  try {
    const { incidentIdentifier } = req.params;

    if (!incidentIdentifier) {
      return res.status(400).json({ error: 'Incident ID are required' });
    }

    const incident = await Incident.findOne({ where: { uuid: incidentIdentifier } });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    await incident.update({ isActive: false });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getIncidentsByOrg,
  createIncident,
  updateIncident,
  deleteIncident
};
