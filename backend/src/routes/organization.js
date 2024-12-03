const express = require('express');
const orgController = require('../controllers/organization');
const userAuthMiddleware = require('../middleware/userAuth');
const router = express.Router();

router.get('/public/orgs', orgController.getAllOrganizations);
router.get('/public/org/:orgIdentifier', orgController.getOrgByIdentifier);

router.use(userAuthMiddleware);
router.get('/org/check-invite', orgController.checkInviteCode);

router.post('/org', orgController.createOrganization);
router.post('/org/join', orgController.joinOrganization);

router.get('/org/:orgIdentifier/members', orgController.getMembersByOrg);

router.get('/org/:orgIdentifier/invite-code', orgController.getOrgInviteCode);
router.post('/org/:orgIdentifier/regenerate-invite-code', orgController.regenerateOrgInviteCode);

module.exports = router;