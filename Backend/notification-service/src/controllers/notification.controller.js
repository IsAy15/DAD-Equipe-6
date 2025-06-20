const Notification = require('../models/notification.model');

exports.createNotification = async (req, res) => {
    const { userId, type, content, link } = req.body;

    if (!userId || !type || !content) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const notification = new Notification({
        userId,
        type,
        content,
        link: link || ''
        });

        await notification.save();

        return res.status(201).json({ message: 'Notification created', id: notification._id });
    } catch (err) {
        console.error('Error creating notification:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/notifications/:userId
exports.getUserNotifications = async (req, res) => {
    const { userId } = req.params;

    try {
        const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 }); // les plus récentes d’abord

        return res.status(200).json(notifications);
    } catch (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
