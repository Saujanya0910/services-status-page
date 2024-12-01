const { Service, Organization, Incident } = require('../models');
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
          { name: orgIdentifier }
        ]
      },
      include: {
        model: Service,
        attributes: { exclude: ['createdAt', 'updatedAt', 'organizationId', 'isActive'] },
        where: { isActive: true }
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization.Services);
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
          { name: serviceIdentifier }
        ]
      },
      include: {
        model: Incident,
        attributes: { exclude: ['createdAt', 'updatedAt', 'serviceId', 'isActive'] },
        where: { isActive: true }
      }
    });

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(service.Incidents);
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

    res.status(201).json(service);
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
    const { serviceId } = req.params;
    const { name, description, status } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await service.update({
      name: name || service.name,
      description: description || service.description,
      status: status || service.status
    });

    res.json(service);
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

module.exports = {
  getServicesByOrg,
  getIncidentsByService,
  addService,
  updateService,
  deleteService
};