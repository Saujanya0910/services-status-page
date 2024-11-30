const express = require('express');
const userRoutes = require('./user');
const organizationRoutes = require('./organization');
const serviceRoutes = require('./service');
const incidentRoutes = require('./incident');
const checkJwt = require('../middleware/auth');

const router = express.Router();

router.use('/users', checkJwt, userRoutes);
router.use('/organizations', checkJwt, organizationRoutes);
router.use('/services', checkJwt, serviceRoutes);
router.use('/incidents', checkJwt, incidentRoutes);

module.exports = router;