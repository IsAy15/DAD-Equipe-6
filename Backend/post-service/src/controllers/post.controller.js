const Post = require('../models/Post.js');
const mongoose = require('mongoose');

module.exports = {
    
    getPostsByUserId: async (req, res) => {
        // Controller logic to retrieve posts by user id goes here
        const user_id = req.params.user_id;
        try{
            const posts = await Post.find({ author: user_id })
            .lean()
            .exec();
    
            if(posts) {
                return res.status(200).json(posts);
            }
    
            return res.status(404).json({ message: 'No posts found for this user' });

        }catch(err) {
            return res.status(500).json({ message: 'Failed to retrieve posts', details: err.message });
        }

    },
    getPostsOfSubscribdedTo: async (req, res) => {
        try{
            const user_id = req.params.user_id;

            if(!user_id){
                return res.status(400).json({ message: 'User id is required' });
            }

            const friends_ids = await fetch(`http://localhost:8080/api/user/${user_id}/friends`, {
                method: 'GET'
            }).then((response) => response.json());

            if(!friends_ids){
                return res.status(500).json({ message: 'Unable to get user friends' });
            }

            const feed = await Post.find().where('author').in(friends_ids).lean().exec();

            if(!feed){
                return res.status(204).json({ message: 'No feed available' });
            }

            return feed;

        }catch(err){
            return res.status(500).json({ message: 'Unable to get user feed', details: err.message });
        }
    },
    createPost: async (req, res) => {
        // Controller logic to create a new post goes here

        try{
            const user_id = req.params.user_id;
            const { content, tags, imageUrls, videoUrls } = req.body;
    
            //TODO : Check if the author is the same as the logged-in user

            //TODO : Validate the input data
    
            const newPost = new Post({user_id,
                                    content,
                                    tags,
                                    imageUrls,
                                    videoUrls
            });     
    
            await newPost.save()
                .then(post => res.status(201).json(post))
                .catch(err => res.status(500).json({ message: 'Failed to create post', details: err.message }));

        }
        catch(err) {
            return res.status(500).json({ message: 'Failed to create post', details: err.message });
        }

    },
    updatePost: async (req, res) => {
        try{
            const postId = req.params.post_id;
    
            if(!postId) {
                return res.status(400).json({ message: 'Post id is required' });
            }
            
            const { content, tags, imageUrls, videoUrls } = req.body;
            
            const updatedPost = await Post.findByIdAndUpdate(
                new mongoose.Types.ObjectId(postId), 
                {
                    content,
                    tags,
                    imageUrls,
                    videoUrls
                },
                { new: true }
            )
            .lean()
            .exec();

            if(!updatedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            return res.status(200).json(updatedPost);
        }
        catch(err) {
            return res.status(500).json({ message: 'Failed to update post', details: err.message });
        }
    },

    deletePost: async (req, res) => {
        try{
            const postId = req.params.post_id;
     
             if(!postId) {
                 return res.status(400).json({ message: 'Post id is required' });
             }
     
             const deletedPost = await Post.findByIdAndDelete( new mongoose.Types.ObjectId(postId))
             .lean()
             .exec();

            if(!deletedPost) {
                return res.status(404).json({ message: 'Post not found' });
            }
            return res.status(204).json({ message: 'Post deleted successfully' });
        }
        catch(err) {
            return res.status(500).json({ message: 'Failed to delete post', details: err.message });
        }
    },
}