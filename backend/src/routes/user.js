const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();

router.post('/user', userController.createOrUpdateUser);
router.put('/user/:userIdentifier', userController.updateUser);

module.exports = router;