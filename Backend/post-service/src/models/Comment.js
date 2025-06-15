const mongoose = require('mongoose');


/**
 * @swagger
 * components:
 *  schemas:
 *   Comment:
 *    type: object
 *    properties:
 *     author:
 *      type: string
 *      description: The ID of the user who authored the comment
 *      example: "60c72b2f9b1e8c001c8e4d3a"
 *     post:
 *      type: string
 *      description: The id of the post the comment belongs to
 *      example: "60c72b2f9b1e8c001c8e4d3b"
 *     content:
 *      type: string
 *      description: The content of the comment
 *      example: "This is a sample comment."
 *     parentComment:
 *      type: string
 *      description: The ID of the parent comment if this is a reply to another comment
 *      example: "60c72b2f9b1e8c001c8e4d3b"
 *     likes:
 *      type: array
 *      description: List of user IDs who liked the comment
 *      example: ["60c72b2f9b1e8c001c8e4d3c", "60c72b2f9b1e8c001c8e4d3d"]
 *      items:
 *       type: string
 *       description: The ID of the user who liked the comment
 */
const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    content: { type: String, required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
