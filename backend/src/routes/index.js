const express = require('express');
const userRoutes = require('./user');
const organizationRoutes = require('./organization');
const serviceRoutes = require('./service');
const incidentRoutes = require('./incident');
const checkJwt = require('../middleware/auth');

const router = express.Router();

// checkJwt

router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/services', serviceRoutes);
router.use('/incidents', incidentRoutes);

module.exports = router;