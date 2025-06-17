const express = require("express");
const userAuthController = require('../controllers/user-auth.controller');
const router = express.Router();

router.get('/auth-data', userAuthController.getAuthData);
router.post('/', userAuthController.createUser);

module.exports = router;
