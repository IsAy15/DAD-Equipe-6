const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    type: { 
        type: String, 
        enum: ['like', 'mention', 'follow', 'comment'], 
        required: true 
    },
    sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },   
    comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, 
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
