const router = require('express').Router();
const commentController = require('../controllers/comment.controller');

// Routes for /posts/:post_id/comments

router.get('/', commentController.getPostComments)
      .post('/', commentController.addCommentToPost)
      .put('/:comment_id', commentController.updateCommentFromPost)
      .delete('/:comment_id', commentController.deleteCommentFromPost);

router.get(':comment_id/replies', commentController.getCommentReplies)
      .post(':comment_id/replies', commentController.addReplyToComment)
      .put('/:comment_id/replies/:reply_id', commentController.updateReplyFromComment)
      .delete('/:comment_id/replies/:reply_id', commentController.deleteReplyFromComment);
