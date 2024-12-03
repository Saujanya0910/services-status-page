const express = require('express');
const userController = require('../controllers/user');
const userAuthMiddleware = require('../middleware/userauth');
const router = express.Router();

router.use(userAuthMiddleware);

router.post('/user', userController.createOrUpdateUser);
router.put('/user/:userIdentifier', userController.updateUser);

module.exports = router;