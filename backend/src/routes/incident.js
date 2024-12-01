const express = require('express');
const incidentController = require('../controllers/incident');
const router = express.Router();

router.get('/org/:orgIdentifier/incidents', incidentController.getIncidentsByOrg);

module.exports = router;