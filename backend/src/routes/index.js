const express = require('express');
const userRoutes = require('./user');
const organizationRoutes = require('./organization');
const serviceRoutes = require('./service');
const incidentRoutes = require('./incident');

const router = express.Router();

router.use(userRoutes);
router.use(organizationRoutes);
router.use(serviceRoutes);
router.use(incidentRoutes);

module.exports = router;