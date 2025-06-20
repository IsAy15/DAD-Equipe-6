const express = require('express');
const router = express.Router();
const controller = require('../controllers/notification.controller');

router.post('/', controller.createNotification);
router.get('/:userId', controller.getUserNotifications);
router.get('/:userId/count', controller.getNotificationCount);
router.delete('/:notificationId', controller.readAndDelete);
router.delete('/all/:userId', controller.readAllAndDelete);
router.post('/api/notifications/on-post-created', controller.onPostCreated);

module.exports = router;
