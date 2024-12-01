const express = require('express');
const { User } = require('../models');
const { saveUser } = require('../controllers/user');
const router = express.Router();

// Get current user
router.get('/me', async (req, res) => {
  try {
    const user = await User.findOne({ where: { auth0Id: req.user.sub } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update user
router.put('/me', async (req, res) => {
  try {
    const user = await User.findOne({ where: { auth0Id: req.user.sub } });
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save user
router.post('/user', saveUser);

module.exports = router;