const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');
const mongoose = require('mongoose');

module.exports = {
    getPostComments: async (req,res) => {
        try{
            const post_id = req.params.post_id;

            if (!post_id) {
                return res.status(400).json({ message: 'Post ID is required' });
            }

            const postComments = await Comment.find({ post: post_id }).lean().exec();

            if(postComments?.length === 0) {
                return res.status(404).json({ message: 'No comments found for this post' });
            }

            return res.status(200).json(postComments);
        }
        catch (error) {
            console.error('Error retrieving comments:', error);
            return res.status(500).json({ message: 'Failed to retrieve comments', error: error.message });
        }
    },

    addCommentToPost: async (req, res) => {
        try{
            const post_id = req.params.post_id;
            const { author, content, parentComment } = req.body;

            if (!post_id || !author || !content) {
                return res.status(400).json({ message: 'Post ID, author, and content are required'});
            }

            const postExists = await Post.exists({ _id: post_id }).lean().exec();
            if (!postExists) {
                return res.status(404).json({ message: 'Post not found' });
            }

            const newComment = new Comment({
                author,
                post: post_id,
                content,
                parentComment
            });

            await newComment.save()
                .then(comment => res.status(201).json(comment))
        }
        catch (error) {
            console.error('Error in addCommentToPost:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    updateCommentFromPost: async (req, res) => {
        try{
            const commentId = req.params.comment_id;
            const { content } = req.body;

            if (!commentId || !content) {
                return res.status(400).json({ message: 'Comment ID and content are required' });
            }

            await Comment.findByIdAndUpdate(new mongoose.Types.ObjectId(commentId), { content }, { new: true })
                .lean()
                .exec()
                .then(updatedComment => {
                    if (!updatedComment) {
                        return res.status(404).json({ message: 'Comment not found' });
                    }
                    return res.status(200).json(updatedComment);
                })
        }
        catch (error) {
            console.error('Error updating comment:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    deleteCommentFromPost: async (req, res) => {
        try{
            const commentId = req.params.comment_id;

            if (!commentId) {
                return res.status(400).json({ message: 'Comment ID is required' });
            }

            await Comment.findByIdAndDelete(new mongoose.Types.ObjectId(commentId))
                .lean()
                .exec()
                .then(deletedComment => {
                    if (!deletedComment) {
                        return res.status(404).json({ message: 'Comment not found' });
                    }
                    return res.status(200).json({ message: 'Comment deleted successfully' });
                })
        }
        catch (error) {
            console.error('Error deleting comment:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },

    getCommentReplies: async (req, res) => {
        try{
            const comment_id = req.params.comment_id;

             if (!comment_id) {
                return res.status(400).json({ message: 'Comment_id is required' });
            }

            const comments = await Comment.find({ comment: comment_id}).lean().exec();

            if(comments?.length == 0){
                return res.status(404).json('No replies found for this comment');
            }

            return res.status(200).json(comments);

        }catch{
            console.error('Error getting comment replies', error);
            return res.status(500).json({message : 'Internal server error', error: error.message})
        }
    },

    addReplyToComment: async (req, res) => {
        try {
                const { post_id, comment_id } = req.params;
                const { content, author } = req.body;

                if (!content || !author) {
                    return res.status(400).json({ message: 'Content and author are required' });
                }

                // Vérification que le commentaire parent existe
                const parentComment = await Comment.findById(comment_id).exec();
                if (!parentComment) {
                    return res.status(404).json({ message: 'Parent comment not found' });
                }

                const newReply = new Comment({
                    content,
                    author,
                    post: post_id,
                    comment: comment_id, // lien au commentaire parent
                });

                await newReply.save()
                    .then(reply => res.status(201).json(reply));

                return res.status(201).json(newReply);
            } catch (error) {
                console.error('Error adding reply to comment:', error);
                return res.status(500).json({ message: 'Internal server error', error: error.message });
            }
    },

    updateReplyFromComment: async (req, res) => {
        try {
            const { post_id, comment_id, reply_id } = req.params;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ message: 'Content is required for update' });
            }

            const reply = await Comment.findOneAndUpdate(
                { comment: comment_id },
                { content },
                { new: true }
            ).exec();

            if (!reply) {
                return res.status(404).json({ message: 'Reply not found' });
            }

            return res.status(200).json(reply);

        } catch (error) {
            console.error('Error updating reply:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
    deleteReplyFromComment: async (req, res) => {
        try {
            const { post_id, comment_id, reply_id } = req.params;

            const deleted = await Comment.findOneAndDelete({
                comment: comment_id,
            }).exec();

            if (!deleted) {
                return res.status(404).json({ message: 'Reply not found' });
            }

            return res.status(200).json({ message: 'Reply successfully deleted' });
        } catch (error) {
            console.error('Error deleting reply:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    },
}
