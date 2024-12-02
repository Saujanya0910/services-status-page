const express = require('express');
const serviceController = require('../controllers/service');
const router = express.Router();

router.get('/org/:orgIdentifier/services', serviceController.getServicesByOrg);
router.get('/service/:serviceIdentifier', serviceController.getServiceByIdentifier);
router.get('/service/:serviceIdentifier/incidents', serviceController.getIncidentsByService);

module.exports = router;