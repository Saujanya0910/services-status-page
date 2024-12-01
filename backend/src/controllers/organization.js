const { Organization, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Get organization details by UUID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getOrganizationByUuid = async (req, res) => {
  try {
    const { orgUuid } = req.params;
    if (!orgUuid || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(orgUuid)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }

    const organization = await Organization.findOne({
      where: { uuid: orgUuid, isActive: true },
      attributes: ['uuid', 'name'],
      include: [{
        model: User,
        attributes: ['uuid', 'email', 'name', 'role'],
        where: { isActive: true }
      }]
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Create a new organization and link the requested user to it
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const createOrganization = async (req, res) => {
  try {
    const { name, createdBy } = req.body;

    if (!name || !createdBy) {
      return res.status(400).json({ error: 'Name and createdBy are required' });
    }

    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const organization = await Organization.create({
      name,
      createdBy: user.id
    });

    await user.update({ organizationId: organization.id });

    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getOrganizationByUuid,
  createOrganization
};