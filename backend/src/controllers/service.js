const { Service, Organization, Incident, IncidentUpdate } = require('../models');
const { Op } = require('sequelize');

/**
 * Get all services of an organization by name or UUID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getServicesByOrg = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization identifier is required' });
    }

    const organization = await Organization.findOne({
      where: {
        [Op.or]: [
          { uuid: orgIdentifier },
          { name: { [Op.like]: orgIdentifier } }
        ],
        isActive: true
      },
      include: {
        model: Service,
        attributes: { exclude: ['id', 'createdAt', 'organizationId', 'isActive'] },
        where: { isActive: true }
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.json(organization.Services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get a service by name or UUID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getServiceByIdentifier = async (req, res) => {
  try {
    const { serviceIdentifier } = req.params;
    if (!serviceIdentifier) {
      return res.status(400).json({ error: 'Service identifier is required' });
    }

    const service = await Service.findOne({
      where: {
        [Op.or]: [
          { uuid: serviceIdentifier },
          { name: { [Op.like]: serviceIdentifier } }
        ],
        isActive: true
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    return res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get all incidents of a service by service ID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getIncidentsByService = async (req, res) => {
  try {
    const { serviceIdentifier } = req.params;
    if (!serviceIdentifier) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const service = await Service.findOne({ 
      where: {
        [Op.or]: [
          { uuid: serviceIdentifier },
          { name: { [Op.like]: serviceIdentifier } }
        ],
        isActive: true
      },
      include: [{
        model: Incident,
        attributes: { exclude: ['createdAt', 'serviceId', 'isActive'] },
        where: { isActive: true },
        required: false,
        order: [['createdAt', 'DESC']],

        include: [{
          model: IncidentUpdate,
          attributes: { exclude: ['createdAt', 'id', 'incidentId', 'isActive'] },
          where: { isActive: true },
          required: false,
          order: [['createdAt', 'DESC']]
        }]
      }]
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const incidents = service.Incidents.map(incident => {
      const { uuid, title, description, status, createdAt, updatedAt, IncidentUpdates } = incident;
      return { uuid, title, description, status, createdAt, updatedAt, updates: IncidentUpdates };
    });
    return res.status(incidents.length ? 200 : 404).json(incidents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Add a new service to an organization
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const addService = async (req, res) => {
  try {
    const { name, description, status, organizationId } = req.body;

    if (!name || !status || !organizationId) {
      return res.status(400).json({ error: 'Name, status, and organizationId are required' });
    }

    const organization = await Organization.findByPk(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    const service = await Service.create({
      name,
      description,
      status,
      organizationId
    });

    return res.status(201).json({ uuid: service.uuid, name: service.name, createdAt: service.createdAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Update a service's details
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const updateService = async (req, res) => {
  try {
    const { serviceIdentifier } = req.params;
    const { name, description, status } = req.body;

    if (!serviceIdentifier) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const service = await Service.findOne({
      where: {
        [Op.or]: [
          { uuid: serviceIdentifier },
          { name: { [Op.like]: serviceIdentifier } }
        ],
        isActive: true
      }
    });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.update({
      name: name || service.name,
      description: description || service.description,
      status: status || service.status
    });

    return res.json({ uuid: service.uuid, name: service.name, description: service.description, updatedAt: service.updatedAt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Soft-delete a service
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.update({ isActive: false });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const addIncidentUpdate = async (req, res) => {
  try {
    const { serviceIdentifier, incidentIdentifier } = req.params;
    const { message } = req.body;

    if (!serviceIdentifier || !incidentIdentifier) {
      return res.status(400).json({ error: 'Service ID and Incident ID are required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const service = await Service.findOne({ where: { uuid: serviceIdentifier } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const incident = await Incident.findOne({ where: { uuid: incidentIdentifier } });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const update = await IncidentUpdate.create({ message, incidentId: incident.id });
    return res.status(201).json({ uuid: update.uuid, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

const updateIncidentUpdate = async (req, res) => {
  try {
    const { serviceIdentifier, incidentIdentifier, updateIdentifier } = req.params;
    const { message } = req.body;

    if (!serviceIdentifier || !incidentIdentifier || !updateIdentifier) {
      return res.status(400).json({ error: 'Service ID, Incident ID, and Update ID are required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const service = await Service.findOne({ where: { uuid: serviceIdentifier } });
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const incident = await Incident.findOne({ where: { uuid: incidentIdentifier } });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }

    const update = await IncidentUpdate.findOne({ where: { uuid: updateIdentifier } });
    if (!update) {
      return res.status(404).json({ error: 'Incident update not found' });
    }

    await update.update({ message });
    return res.json({ uuid: update.uuid, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Delete an incident update of a service
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const deleteIncidentUpdate = async (req, res) => {
  try {
    const { updateIdentifier } = req.params;

    const update = await IncidentUpdate.findOne({ where: { uuid: updateIdentifier } });
    if (!update) {
      return res.status(404).json({ error: 'Incident update not found' });
    }

    await update.update({ isActive: false });

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getServicesByOrg,
  getServiceByIdentifier,
  getIncidentsByService,
  addService,
  updateService,
  deleteService,
  addIncidentUpdate,
  updateIncidentUpdate,
  deleteIncidentUpdate
};