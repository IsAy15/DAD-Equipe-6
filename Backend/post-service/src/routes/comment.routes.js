const router = require('express').Router({ mergeParams: true });
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

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}/replies:
 *  get:
 *   tags:
 *    - Replies
 *   summary: Retrieves the replies to a specific comment on a post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the post containing the comment
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the comment that the reply is replying to
 *   responses:
 *    200:
 *     description: A list of the replies to the specified comment
 *    404:
 *     description : Post or comment not found
 *    500:
 *     description: Failed to get the replies
 */
router.get(':comment_id/replies', commentController.getCommentReplies);

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}/replies:
 *  post:
 *   tags:
 *    - Replies
 *   summary: Adds a reply to a specific comment on a post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the post containing the comment
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the comment being replied to
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        content:
 *         type: string
 *         description: The content of the reply
 *   responses:
 *    201:
 *     description: Reply successfully added
 *    400:
 *     description: Invalid input data
 *    404:
 *     description: Post or comment not found
 *    500:
 *     description: Failed to add reply
 */
router.post(':comment_id/replies', commentController.addReplyToComment);

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}/replies/{reply_id}:
 *  put:
 *   tags:
 *    - Replies
 *   summary: Updates a specific reply to a comment on a post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the post containing the comment
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the comment that the reply is attached to
 *    - in: path
 *      name: reply_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the reply to update
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        content:
 *         type: string
 *         description: The updated content of the reply
 *   responses:
 *    200:
 *     description: Reply successfully updated
 *    400:
 *     description: Invalid input data
 *    404:
 *     description: Post, comment, or reply not found
 *    500:
 *     description: Failed to update reply
 */
router.put('/:comment_id/replies/:reply_id', commentController.updateReplyFromComment);

/**
 * @swagger
 * /posts/{post_id}/comments/{comment_id}/replies/{reply_id}:
 *  delete:
 *   tags:
 *    - Replies
 *   summary: Deletes a specific reply from a comment on a post
 *   parameters:
 *    - in: path
 *      name: post_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the post containing the comment
 *    - in: path
 *      name: comment_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the comment that the reply is attached to
 *    - in: path
 *      name: reply_id
 *      required: true
 *      schema:
 *       type: string
 *      description: The id of the reply to delete
 *   responses:
 *    200:
 *     description: Reply successfully deleted
 *    404:
 *     description: Post, comment, or reply not found
 *    500:
 *     description: Failed to delete reply
 */
router.delete('/:comment_id/replies/:reply_id', commentController.deleteReplyFromComment);

module.exports = router;
