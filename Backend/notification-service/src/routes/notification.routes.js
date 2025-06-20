const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');

router.post('/', controller.createNotification);
router.get('/:userId', controller.getUserNotifications);

module.exports = router;
