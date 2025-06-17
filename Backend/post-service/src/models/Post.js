const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *  schemas:
 *   CreatePostSchema:
 *    type: object
 *    properties:
 *     content:
 *      type: string
 *      example: "This is a sample post content."
 *      description: The content of the post
 *      maxlength: 280
 *     tags:
 *      type: array
 *      description: List of tags associated with the post
 *      example: ["nature", "montagne"]
 *      items:
 *       type: string
 *     likes:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 *     comments:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 *     imageUrls:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 *     videoUrls:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 * 
 *   UpdatePostSchema:
 *    type: object
 *    properties:
 *     content:
 *      type: string
 *      example: "Updated content example."
 *      description: The content of the post
 *      maxlength: 280
 *     tags:
 *      type: array
 *      description: List of tags associated with the post
 *      example: ["sand", "sea"]
 *      items:
 *       type: string
 *     imageUrls:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 *     videoUrls:
 *      type: array
 *      example: []
 *      items:
 *       type: string
 */

const PostSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, maxlength: 280, required: true },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    imageUrls: [String],
    videoUrls: [String]
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
