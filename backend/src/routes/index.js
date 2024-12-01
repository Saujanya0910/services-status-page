const express = require('express');
const userRoutes = require('./user');
const organizationRoutes = require('./organization');
const serviceRoutes = require('./service');
const incidentRoutes = require('./incident');
const checkJwt = require('../middleware/auth');

const router = express.Router();

// checkJwt

router.use(userRoutes);
router.use(organizationRoutes);
router.use(serviceRoutes);
router.use(incidentRoutes);

module.exports = router;