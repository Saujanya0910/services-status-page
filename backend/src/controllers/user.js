const { User } = require('../models');

require('dotenv').config();

/**
 * Get user by UUID
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const getUserByUuid = async (req, res) => {
  try {
    const { uuid } = req.params;
    if (!uuid || !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid)) {
      return res.status(400).json({ error: 'Invalid UUID format' });
    }

    const user = await User.findOne({
      where: { uuid: req.params.uuid, isActive: true },
      attributes: ['uuid', 'email', 'name', 'role'],
      include: [{
        model: require('../models').Organization,
        attributes: ['uuid', 'name'],
        as: 'organization'
      }]
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    return res.json(user);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Save user to the backend
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const saveUser = async (req, res) => {
  try {
    const { user: userDetails, organization: orgDetails } = req.body;

    if (!(userDetails && orgDetails)) {
      return res.status(400).json({ error: 'User & org details are required' });
    }

    const { name, email, sub } = userDetails;
    const { orgIdentifier } = orgDetails;

    let isNewOrganization = false;
    let organization = await require('../models').Organization.findOne({
      where: {
        [Op.or]: [
          { uuid: orgIdentifier },
          { name: orgIdentifier }
        ]
      }
    });

    let isNewUser = false;
    let user = await User.findOne({ where: { email } });

    if(!user) {
      user = await User.create({
        name,
        email,
        organizationId: organization.id,
        role: isNewOrganization ? 'admin' : 'member',
        auth0Id: sub
      });
      isNewUser = true;
    } else {
      if(user.organizationId) {
        return res.status(400).json({ error: 'User already belongs to an organization' });
      }
    }

    if (!organization) {
      organization = await require('../models').Organization.create({ name: orgIdentifier });
      isNewOrganization = true;
      if(!user.organizationId) {
        await user.update({ organizationId: organization.id, role: 'admin' });
      }
    }

    return res.status(201).json({ user: { uuid: user.uuid, email }, organization: { uuid: organization.uuid, name: organization.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Logout user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const logoutUser = (req, res) => {
};

module.exports = {
  getUserByUuid,
  logoutUser,
  saveUser
};