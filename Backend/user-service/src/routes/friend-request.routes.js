// routes/friend-request.routes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/friend-request.controller');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/send/:receiverId', verifyJWT, controller.sendFriendRequest);
router.post('/:requestId/accept', verifyJWT, controller.acceptFriendRequest);
router.post('/:requestId/refuse', verifyJWT, controller.refuseFriendRequest);

router.get('/received', verifyJWT, controller.getReceivedRequests);
router.get('/sent', verifyJWT, controller.getSentRequests);


module.exports = router;