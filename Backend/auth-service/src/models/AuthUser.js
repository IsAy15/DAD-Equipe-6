const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *      AuthUser:
 *          type: object
 *          required:
 *              - email
 *              - username
 *              - passwordHash
 *          properties:
 *              email:
 *                  type: string
 *                  format: email
 *                  default: jhon.doe@gmail.com
 *              username:
 *                  type: string
 *                  default: jhon_doe
 *              passwordHash:
 *                  type: string
 *                  default : xxxxyyyzzz
 *              role:
 *                  type: string
 *                  enum: [user, moderator, admin]
 *              isVerified:
 *                  type: boolean
 *              createdAt:
 *                  type: string
 *                  format: date-time
 */
const AuthUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AuthUser', AuthUserSchema);
