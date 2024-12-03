const express = require('express');
const userRoutes = require('./user');
const organizationRoutes = require('./organization');
const serviceRoutes = require('./service');
const incidentRoutes = require('./incident');
const sseController = require('../controllers/server-sent-events/index');

const router = express.Router();

router.get('/events', sseController.handleSSE);

router.use(userRoutes);
router.use(organizationRoutes);
router.use(serviceRoutes);
router.use(incidentRoutes);

module.exports = router;