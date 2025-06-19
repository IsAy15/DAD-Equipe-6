const express = require('express');
const router = express.Router();
const userFollowController = require('../controllers/user-follow.controller');


//Read
router.get('/:userId/followers', userFollowController.getFollowers);
router.get('/:userId/following', userFollowController.getFollowing);
router.get('/:userId/friends', userFollowController.getFriends);
router.get('/:userIdOrUsername', userFollowController.getPublicUserInfo);

module.exports = router;
