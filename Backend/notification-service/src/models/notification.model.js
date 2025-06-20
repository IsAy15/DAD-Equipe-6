const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true // ID du destinataire
    },
    type: {
        type: String,
        required: true,
        enum: [
        'friend_request',   // quelqu’un t’a envoyé une demande d’ami
        'friend_accept',    // ta demande d’ami a été acceptée
        'message',          // tu as reçu un message
        'mention',          // tu as été mentionné
        'friend_post',      // un ami a publié quelque chose
        'post_reply',       // quelqu’un a répondu à ton post
        'comment_reply'     // quelqu’un a répondu à ton commentaire
        ]
    },
    content: {
        type: String,
        required: true // texte lisible (ex : "Alice t'a envoyé un message")
    },
    link: {
        type: String, // lien cliquable (ex : "/posts/abc123")
        default: ''
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
