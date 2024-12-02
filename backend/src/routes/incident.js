const express = require('express');
const incidentController = require('../controllers/incident');
const router = express.Router();

router.get('/org/:orgIdentifier/incidents', incidentController.getIncidentsByOrg);
router.post('/incident/:incidentIdentifier', incidentController.createIncident);
router.put('/incident/:incidentIdentifier', incidentController.updateIncident);
router.delete('/incident/:incidentIdentifier', incidentController.deleteIncident);

module.exports = router;