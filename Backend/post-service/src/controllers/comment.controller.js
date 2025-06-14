const { Comment } = require('../models/comment.model');

module.exports = {
    getPostComments: (req,res) => {

    },

    addCommentToPost: (req, res) => {
        // Controller logic to add a comment to a post goes here
        const postId = req.params.post_id;

    },

    updateCommentFromPost: (req, res) => {
        // Controller logic to update a comment from a post goes here
    },

    deleteCommentFromPost: (req, res) => {
        // Controller logic to delete a comment from a post goes here
    },

    getCommentReplies: (req, res) => {
    
    },

    addReplyToComment: (req, res) => {

    },

    updateReplyFromComment: (req, res) => {

    },
    deleteReplyFromComment: (req, res) => {

    },
}
