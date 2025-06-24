const Post = require('../models/Post')
const Comment = require('../models/Comment')

module.exports = {
    likePost: async (req, res) => {
        try{
            const post_id = req.params.post_id;
            const { user_id } = req.userId;

            if(!user_id){
                return res.status(400).json({ message: 'Authour field is requiered in body'});
            }

            const post = await Post.findById(post_id).exec();

            if(!post){
                return res.status(404).json({ message: 'Post not found'});
            }

            if(!post.likes.includes(user_id)){
                post.likes.push(user_id);
            }else{
                res.status(400).json({ message: 'User has already liked the post'});
            }

            post.save(post)
            .then(() => {
                return res.status(201).json({ message: 'Like added'});
            })
            .catch((err) => {
                return res.status(500).json({ message: 'Unable to like post', details: err.message});
            })
        }
        catch(err){
            return res.status(500).json({ message: 'Unable to like post', details: err.message});
        }
    },
    unlikePost: async (req, res) => {
        try {
            const post_id = req.params.post_id;
            const { user_id } = req.userId;

            if (!user_id) {
                return res.status(400).json({ message: 'User ID is required in body' });
            }

            //Check if user that liked exist
            const userExist = fetch(`http://localhost:8080/api/user/${user_id}/exists`)
                .then((response) => response.json());

           const post = await Post.findById(post_id).exec();

            if(!post){
                return res.status(404).json({ message: 'Post not found'});
            }

            if(post.likes.includes(user_id)){
                post.likes.remove(user_id);
            }else{
                res.status(400).json({ message: 'User did not liked the post'});
            }

            post.save(post)
            .then(() => {
                return res.status(201).json({ message: 'Like removed'});
            })
            .catch((err) => {
                return res.status(500).json({ message: 'Unable to unlike post', details: err.message});
            })

            return res.status(200).json({ message: 'Like removed' });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Unable to unlike post', details: err.message});
        }
    },

    likeComment: async (req, res) => {
        try{
            const comment_id = req.params.comment_id;
            const { user_id } = req.userId;

            if(!user_id){
                return res.status(400).json({ message: 'Could not get user id from token'});
            }

            const comment = await Comment.findById(post_id).exec();

            if(!comment){
                return res.status(404).json({ message: 'Comment not found'});
            }

            if(!comment.likes.includes(user_id)){
                comment.likes.push(user_id);
            }else{
                res.status(400).json({ message: 'User has already liked the comment'});
            }

            comment.save(comment)
            .then(() => {
                return res.status(201).json({ message: 'Like added'});
            })
            .catch((err) => {
                return res.status(500).json({ message: 'Unable to like comment', details: err.message});
            })
        }
        catch(err){
            return res.status(500).json({ message: 'Unable to like comment', details: err.message});
        }
    },
    unlikeComment: async (req, res) => {
        try {
            const comment_id = req.params.comment_id;
            const { user_id } = req.userId;

            if (!user_id) {
                return res.status(400).json({ message: 'Could not get user id from token' });
            }

            //Check if user that liked exist
            // const userExist = fetch(`http://localhost:8080/api/user/${user_id}/exists`)
                // .then((response) => response.json());

           const comment = await Comment.findById(comment_id).exec();

            if(!comment){
                return res.status(404).json({ message: 'Comment not found'});
            }

            if(comment.likes.includes(user_id)){
                comment.likes.remove(user_id);
            }else{
                res.status(400).json({ message: 'User did not liked the comment'});
            }

            comment.save(comment)
            .then(() => {
                return res.status(201).json({ message: 'Like removed'});
            })
            .catch((err) => {
                return res.status(500).json({ message: 'Unable to unlike comment', details: err.message});
            })

        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: 'Unable to unlike comment', details: err.message});
        }
    },
}