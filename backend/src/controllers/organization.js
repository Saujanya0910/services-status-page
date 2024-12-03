const { Organization, User } = require('../models');
const { Op } = require('sequelize');
const { sendEvent } = require('./server-sent-events');

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
    const { name, userIdentifier } = req.body;

    if (!name || !userIdentifier) {
      return res.status(400).json({ error: 'Name and userIdentifier are required' });
    }

    const user = await User.findOne({
      where: { 
        [Op.or]: [
          { uuid: userIdentifier }, 
          { email: userIdentifier }
        ], 
        isActive: true, 
        organizationId: null 
      }
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const organization = await Organization.create({
      name,
      createdBy: user.id
    });

    await user.update({ organizationId: organization.id, role: 'admin' });

    sendEvent('organizationCreated', { uuid: organization.uuid, name: organization.name, createdAt: organization.createdAt });

    return res.status(201).json({ uuid: organization.uuid, name: organization.name, createdAt: organization.createdAt });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Join an organization by invite code
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const joinOrganization = async (req, res) => {
  try {
    const { inviteCode, userIdentifier } = req.body;
    if(!inviteCode || !userIdentifier) {
      return res.status(400).json({ error: 'Invite code and user identifier are required' });
    }

    let user = await User.findOne({ where: { uuid: userIdentifier } });
    const organization = await Organization.findOne({
      where: {
        inviteCode: inviteCode,
        isActive: true
      }
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    await user.update({ organizationId: organization.id, role: 'member' });
    
    return res.status(201).json({ uuid: user.uuid, email: user.email, name: user.name, role: user.role });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Check if an invite code is valid
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const checkInviteCode = async (req, res) => {
  try {
    const { inviteCode } = req.query;
    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const organization = await Organization.findOne({ where: { inviteCode }, isActive: true });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.json({ uuid: organization.uuid, name: organization.name });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Get organization details by identifier (UUID or name)
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getOrgByIdentifier = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization identifier is required' });
    }

    const organization = await Organization.findOne({
      attributes: ['uuid', 'name', 'createdAt'],
      where: {
        [Op.or]: [
          { uuid: orgIdentifier.trim() },
          { name: { [Op.like]: `%${decodeURIComponent(orgIdentifier.trim().toLowerCase())}%` } }
        ]
      },
      include: {
        model: User,
        attributes: ['uuid', 'email', 'name', 'role'],
        where: { isActive: true },
        required: false
      }
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    delete organization.dataValues.Users;
    return res.json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Get all organizations
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getAllOrganizations = async (req, res) => {
  try {
    const search = req.query.search || '';
    const organizations = await Organization.findAll({
      attributes: ['uuid', 'name'],
      where: { isActive: true, name: { [Op.like]: `%${decodeURIComponent(search).trim()}%` } }
    });
    res.json(organizations);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Get all members of an organization by name or UUID
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getMembersByOrg = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization identifier is required' });
    }

    const organization = await Organization.findOne({
      where: {
        [Op.or]: [
          { uuid: orgIdentifier.trim() },
          { name: { [Op.like]: `%${orgIdentifier.trim().toLowerCase()}%` } }
        ]
      },
      attributes: { exclude: ['id', 'createdBy', 'createdAt', 'updatedAt', 'organizationId'] },

      include: [{
        model: User,
        attributes: { exclude: ['id', 'auth0Id', 'organizationId', 'updatedAt', 'isActive'] },
        where: { isActive: true },
        required: false
      }]
    });

    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.status(organization.Users.length ? 200 : 404).json(organization.Users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Get organization invite code
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getOrgInviteCode = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization UUID is required' });
    }

    const organization = await Organization.findOne({ 
      where: {
        [Op.or]: [
          { uuid: orgIdentifier.trim() },
          { name: { [Op.like]: `%${orgIdentifier.trim().toLowerCase()}%` } }
        ],
        isActive: true
      },
      attributes: ['name', 'uuid', 'inviteCode']
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    return res.json(organization);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * Regenerate organization invite code
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const regenerateOrgInviteCode = async (req, res) => {
  try {
    const { orgIdentifier } = req.params;
    const userId = req.userId;

    if (!orgIdentifier) {
      return res.status(400).json({ error: 'Organization UUID is required' });
    }

    const organization = await Organization.findOne({ 
      where: {
        [Op.or]: [
          { uuid: orgIdentifier.trim() },
          { name: { [Op.like]: `%${orgIdentifier.trim().toLowerCase()}%` } }
        ],
        isActive: true
      },
      attributes: ['id', 'name', 'uuid', 'inviteCode']
    });
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    await organization.update({ inviteCode: require('crypto').randomBytes(4).toString('hex'), updatedBy: userId });

    return res.json({ uuid: organization.uuid, name: organization.name, inviteCode: organization.inviteCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getOrganizationByUuid,
  createOrganization,
  joinOrganization,
  checkInviteCode,
  getOrgByIdentifier,
  getAllOrganizations,
  getMembersByOrg,
  getOrgInviteCode,
  regenerateOrgInviteCode
};