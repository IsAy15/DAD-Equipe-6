const router = require('express').Router();
const postController = require('../controllers/post.controller');

/**
 * @swagger
 * /posts/{username}:
 *  get:
 *   tags:
 *    - Posts
 *   summary: Retrieve posts by username
 *   parameters:
 *    - in: path
 *      name: username
 *      required: true
 *      schema:
 *       type: string
 *       description: The username of the user whose posts are to be retrieved
 *   responses:
 *    200:
 *     description: A list of posts by the specified user
 *    404:
 *     description: User not found
 */
router.get('/:username', postController.getPostsByUsername);

/**
 * @swagger
 * /posts/{username}/feed:
 *  get:
 *   tags:
 *    - Posts
 *   summary: Retrieve posts of users that the user is subscribed to
 *   parameters:
 *    - in: path
 *      name: username
 *      required: true
 *      schema:
 *       type: string
 *       description: The username of the user whose feed is to be retrieved
 *   responses:
 *    200:
 *     description: A list of posts from users that the user is subscribed to
 */
router.get('/:username/feed', postController.getPostsOfSubscribdedTo);

/**
 * @swagger
 * /posts:
 *  post:
 *   tags:
 *    - Posts
 *   summary: Create a new post
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *         description: The title of the post
 *        content:
 *         type: string
 *         description: The content of the post
 *       required:
 *        - title
 *        - content
 *   responses:
 *    201:
 *     description: Post created successfully
 */
router.post('/', postController.createPost);

/**
* @swagger
* /posts/{id}:
*  put:
*   tags:
*     - Posts
*   summary: Update an existing post
*   parameters:
*    - in: path
*      name: id
*      required: true
*      schema:
*       type: string
*       description: The ID of the post to be updated
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       type: object
*       properties:
*        title:
*         type: string
*         description: The new title of the post
*        content:
*         type: string
*         description: The new content of the post
*       required:
*        - title
*        - content
*   responses:
*    200:
*     description: Post updated successfully
*/
router.put('/:id', postController.updatePost);

/**
* @swagger
* /posts/{id}:
*  delete:
*   tags:
*    - Posts
*   summary: Delete a post
*   parameters:
*    - in: path
*      name: id
*      required: true
*      schema:
*       type: string
*       description: The ID of the post to be deleted
*   responses:
*    204:
*     description: Post deleted successfully
*/
router.delete('/:id', postController.deletePost);

module.exports = router;