const express = require("express");
const userAuthController = require('../controllers/user-auth.controller');
const router = express.Router();

router.get('/auth-data', userAuthController.getAuthData);
router.post('/', userAuthController.createUser);

router.post('/:userId/refreshTokens', userAuthController.storeRefreshToken);
router.post('/:userId/refreshTokens/validate', userAuthController.validateRefreshToken);
router.delete('/:userId/refreshTokens', userAuthController.revokeRefreshToken);
router.get('/check-username', userAuthController.isUsernameTaken);

router.get('/search', verifyJWT, userAuthController.searchUsersByUsername);

module.exports = router;
