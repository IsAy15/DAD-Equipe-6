const router = require('express').Router();
const postController = require('../controllers/post.controller');
const {validateBodyObjectId, validateUrlObjectId} = require('../middlewares/validateIds');

// Routes for /api/posts

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Endpoints to manage posts 
 */

/**
 * @swagger
 * /api/posts/{user_id}:
 *   get:
 *     summary: Get all posts by a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 *       404:
 *         description: No posts found for this user
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a post for a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: Author user ID
 *     requestBody:
 *       description: Post data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostCreate'
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts/{user_id}/feed:
 *   get:
 *     summary: Get posts feed from users the given user is subscribed to
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: Posts feed retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostResponse'
 *       204:
 *         description: No content (empty feed)
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/posts/{post_id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: Post ID to update
 *     requestBody:
 *       description: Data to update the post
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUpdate'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: post_id
 *         schema:
 *           type: string
 *           format: objectId
 *         required: true
 *         description: Post ID to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */

router.get('/:user_id',
    validateUrlObjectId('user_id'),
    postController.getPostsByUserId);

router.get('/:user_id/feed',
    validateUrlObjectId('user_id'),
    postController.getPostsOfSubscribdedTo);

router.post('/:user_id', 
    validateUrlObjectId('user_id'),
    postController.createPost);

router.put('/:post_id',
    validateUrlObjectId('post_id'),
    postController.updatePost);

router.delete('/:post_id',
    validateUrlObjectId('post_id'),
    postController.deletePost);

module.exports = router;