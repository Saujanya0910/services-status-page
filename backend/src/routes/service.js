const express = require('express');
const serviceController = require('../controllers/service');
const userAuthMiddleware = require('../middleware/userauth');
const router = express.Router();

router.get('/public/org/:orgIdentifier/services', serviceController.getServicesByOrg);
router.get('/public/service/:serviceIdentifier', serviceController.getServiceByIdentifier);

router.get('/public/service/:serviceIdentifier/incidents', serviceController.getIncidentsByService);

router.use(userAuthMiddleware);

router.post('/org/:orgIdentifier/service', serviceController.addService);
router.put('/service/:serviceIdentifier', serviceController.updateService);
router.delete('/service/:serviceIdentifier', serviceController.deleteService);


router.post('/incident/:incidentIdentifier/incident-update', serviceController.addIncidentUpdate);
router.put('/incident/:incidentIdentifier/incident-update/:updateIdentifier', serviceController.updateIncidentUpdate);
router.delete('/incident-update/:updateIdentifier', serviceController.deleteIncidentUpdate);

module.exports = router;