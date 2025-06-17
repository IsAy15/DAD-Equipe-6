const router = require('express').Router();
const postController = require('../controllers/post.controller');

// Routes for /api/posts

/**
 * @swagger
 * /api/posts/{user_id}:
 *  get:
 *   tags:
 *    - Posts
 *   summary: Retrieve posts by user id
 *   parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the user whose posts are to be retrieved
 *   responses:
 *    200:
 *     description: A list of posts by the specified user
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/UpdatePostSchema' 
 *    404:
 *     description: No posts found for this user
 *    500:
 *     description: Failed to retrieve posts
 */
router.get('/:user_id', postController.getPostsByUserId);

/**
 * @swagger
 * /api/posts/{id}/feed:
 *  get:
 *   tags:
 *    - Posts
 *   summary: Retrieve posts of users that the user is subscribed to
 *   parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *       description: The id of the user whose feed is to be retrieved
 *   responses:
 *    200:
 *     description: A list of posts from users that the user is subscribed to
 */
router.get('/:username/feed', postController.getPostsOfSubscribdedTo);

/**
 * @swagger
 * /api/posts/{user_id}:
 *  post:
 *   tags:
 *    - Posts
 *   summary: Create a new post
 *   parameters:
 *    - in: path
 *      name: user_id
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CreatePostSchema'
 *       
 *   responses:
 *    201:
 *     description: Post created successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/CreatePostSchema'
 *    500:
 *     description: Failed to create post
 */
router.post('/:user_id', postController.createPost);

/**
* @swagger
* /api/posts/{id}:
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
*       description: The id of the post to be updated
*   requestBody:
*    required: true
*    content:
*     application/json:
*      schema:
*       $ref: '#/components/schemas/UpdatePostSchema'
*   responses:
*    200:
*     description: Post updated successfully
*    400:
*     description: Bad request, post ID is required
*    404:
*     description: Post not found
*    500:
*     description: Failed to update post
*/
router.put('/:post_id', postController.updatePost);

/**
* @swagger
* /api/posts/{id}:
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
*    400:
*     description: Bad request, post ID is required
*    404:
*     description: Post not found
*    500:
*     description: Failed to delete post
*/
router.delete('/:post_id', postController.deletePost);

module.exports = router;