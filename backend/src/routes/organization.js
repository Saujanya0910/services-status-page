const express = require('express');
const orgController = require('../controllers/organization');
const router = express.Router();

router.get('/org/check-invite', orgController.checkInviteCode);

router.get('/org/:orgIdentifier', orgController.getOrgByIdentifier);
router.get('/orgs', orgController.getAllOrganizations);

router.post('/org', orgController.createOrganization);
router.post('/org/join', orgController.joinOrganization);

module.exports = router;