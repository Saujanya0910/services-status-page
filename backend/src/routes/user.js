const express = require('express');
const userController = require('../controllers/user');
const userAuthMiddleware = require('../middleware/userAuth');
const router = express.Router();

router.post('/user', userController.createOrUpdateUser);

router.use(userAuthMiddleware);

router.put('/user/:userIdentifier', userController.updateUser);

module.exports = router;