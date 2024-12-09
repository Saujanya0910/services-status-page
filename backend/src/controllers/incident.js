const { Incident, Organization, Service, IncidentUpdate } = require('../models');
const { Op } = require('sequelize');
const { sendEvent } = require('./server-sent-events');

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
          { uuid: decodeURIComponent(orgIdentifier.trim().toLowerCase()) },
          { name: { [Op.like]: `%${decodeURIComponent(orgIdentifier.trim().toLowerCase())}%` } }
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

/**
 * Create an incident
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */ 
const createIncident = async (req, res) => {
  try {
    const { serviceIdentifier } = req.params;
    const { title, status, description } = req.body;
    const userId = req.userId;

    if (!serviceIdentifier) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Title, status and description are required' });
    }

    const service = await Service.findOne({ 
      where: { uuid: serviceIdentifier } ,
      include: [{
        model: Organization,
        attributes: ['name']
      }]
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const incident = await Incident.create({ title, status, description, serviceId: service.id, createdBy: userId });

    sendEvent('incidentCreated', { orgIdentifier: service.Organization.name, serviceIdentifier, uuid: incident.uuid, title, description });

    return res.status(201).json({ uuid: incident.uuid, title, description });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Update an incident
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const updateIncident = async (req, res) => {
  try {
    const { incidentIdentifier } = req.params;
    const { title, description, status } = req.body;
    const userId = req.userId;

    if (!incidentIdentifier) {
      return res.status(400).json({ error: 'Incident ID are required' });
    }

    const incident = await Incident.findOne({ 
      where: { uuid: incidentIdentifier },
      include: [{
        model: Service,
        attributes: ['uuid'],

        include: [{
          model: Organization,
          attributes: ['name']
        }]
      }]
    });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    await incident.update({ title, description, status, updatedBy: userId });

    sendEvent('incidentUpdated', { orgIdentifier: incident.Service.Organization.name, serviceIdentifier: incident.Service.uuid, uuid: incident.uuid, title, description, status, updatedAt: incident.updatedAt });

    return res.json({  uuid: incident.uuid, title, description, status, severity: incident.severity, updatedAt: incident.updatedAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Delete an incident
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deleteIncident = async (req, res) => {
  try {
    const { incidentIdentifier } = req.params;
    const userId = req.userId;

    if (!incidentIdentifier) {
      return res.status(400).json({ error: 'Incident ID are required' });
    }

    const incident = await Incident.findOne({ 
      where: { uuid: incidentIdentifier },
      include: [{
        model: Service,
        attributes: ['uuid'],

        include: [{
          model: Organization,
          attributes: ['name']
        }]
      }]
    });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    await incident.update({ isActive: false, updatedBy: userId });

    sendEvent('incidentDeleted', { orgIdentifier: incident.Service.Organization.name, serviceIdentifier: incident.Service.uuid, uuid: incident.uuid });

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
