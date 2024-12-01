const { User } = require('../models');
const { auth } = require('express-openid-connect');

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
 * Logout user
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
const logoutUser = (req, res) => {
  res.oidc.logout({ returnTo: process.env.APP_URL });
};

module.exports = {
  getUserByUuid,
  logoutUser
};