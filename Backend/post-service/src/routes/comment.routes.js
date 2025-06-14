const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

// Routes for /posts/:post_id/comments

/**
 * @swagger
 * /posts/{post_id}/comments:
 *  get:
 *   tags:
 *    - Comments
 *   summary: Retrieve comments for a specific post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the post for which comments are to be retrieved
 *   responses:
 *    200:
 *     description: A list of comments for the specified post
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Comment'
 *    400:
 *     description: Bad request, post ID is required
 *    404:
 *     description: No comments found for this post
 *    500:
 *     description: Failed to retrieve comments
 */
router.get('/', commentController.getPostComments);

/**
 * @swagger
 * /posts/{post_id}/comments:
 *  post:
 *   tags:
 *    - Comments
 *   summary: Add a comment to a specific post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the post to which the comment is to be added
 *   requestBody:
 *    required: true
 *    content:
 *     application/json: 
 *      schema:
 *       $ref: '#/components/schemas/Comment'
 *   responses:
 *    201:
 *     description: Comment successfully added to the post
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *    400:
 *     description: Invalid request body
 *    404:
 *     description: Post not found 
 *    500:
 *     description: Failed to add comment to the post
 */
router.post('/', commentController.addCommentToPost);

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}:
 *  put:
 *   tags:
 *    - Comments
 *   summary: Update a comment on a specific post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the post containing the comment to be updated
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the comment to be updated
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Comment'
 *   responses:
 *    200:
 *     description: Comment successfully updated
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Comment'
 *    400:
 *     description: Bad request, post ID or comment ID is required
 *    404:
 *     description: Post or comment not found
 *    500:
 *     description: Failed to update comment
 */
router.put('/:comment_id', commentController.updateCommentFromPost);

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}:
 *  delete:
 *   tags:
 *    - Comments
 *   summary: Delete a comment from a specific post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the post containing the comment to be deleted
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the comment to be deleted
 *   responses:
 *    200:
 *     description: Comment successfully deleted
 *    404:
 *     description: Post or comment not found
 *    500:
 *     description: Failed to delete comment
 */
router.delete('/:comment_id', commentController.deleteCommentFromPost);

router.get(':comment_id/replies', commentController.getCommentReplies)
      .post(':comment_id/replies', commentController.addReplyToComment)
      .put('/:comment_id/replies/:reply_id', commentController.updateReplyFromComment)
      .delete('/:comment_id/replies/:reply_id', commentController.deleteReplyFromComment);

module.exports = router;
