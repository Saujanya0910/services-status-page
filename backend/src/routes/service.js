const express = require('express');
const serviceController = require('../controllers/service');
const router = express.Router();

router.get('/org/:orgIdentifier/services', serviceController.getServicesByOrg);
router.get('/service/:serviceIdentifier', serviceController.getServiceByIdentifier);
router.post('/service/:serviceIdentifier', serviceController.addService);
router.put('/service/:serviceIdentifier', serviceController.updateService);
router.delete('/service/:serviceIdentifier', serviceController.deleteService);

router.get('/service/:serviceIdentifier/incidents', serviceController.getIncidentsByService);

router.post('/incident-update', serviceController.addIncidentUpdate);
router.put('/incident-update/:updateIdentifier', serviceController.updateIncidentUpdate);
router.delete('/incident-update/:updateIdentifier', serviceController.deleteIncidentUpdate);

module.exports = router;