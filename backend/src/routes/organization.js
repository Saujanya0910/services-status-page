const express = require('express');
const { Organization, User } = require('../models');
const router = express.Router();

// Get organization details
router.get('/:id', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id, {
      include: [User],
    });
    res.json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create organization
router.post('/', async (req, res) => {
  try {
    const organization = await Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update organization
router.put('/:id', async (req, res) => {
  try {
    const organization = await Organization.findByPk(req.params.id);
    if (organization) {
      await organization.update(req.body);
      res.json(organization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;