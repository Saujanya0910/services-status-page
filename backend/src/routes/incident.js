const express = require('express');
const incidentController = require('../controllers/incident');
const userAuthMiddleware = require('../middleware/userauth');
const router = express.Router();

router.get('/org/:orgIdentifier/incidents', incidentController.getIncidentsByOrg);

router.use(userAuthMiddleware);

router.post('/service/:serviceIdentifier/incident', incidentController.createIncident);
router.put('/incident/:incidentIdentifier', incidentController.updateIncident);
router.delete('/incident/:incidentIdentifier', incidentController.deleteIncident);

module.exports = router;