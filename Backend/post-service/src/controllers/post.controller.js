const Post = require('../models/Post.js');
const mongoose = require('mongoose');
const axios = require('axios');

module.exports = {
    getPostsByUserId: async (req, res) => {
        // Controller logic to retrieve posts by user id goes here
        const user_id = req.params.user_id;
        try {
        const posts = await Post.find({ author: user_id })
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        if (posts?.length == 0) {
            return res.status(404).json({ message: "No post found for this user" });
        }

        if (posts) {
            return res.status(200).json(posts);
        }

        return res.status(404).json({ message: "No posts found for this user" });
        } catch (err) {
        return res
            .status(500)
            .json({ message: "Failed to retrieve posts", details: err.message });
        }
    },

    getPostsOfSubscribdedTo: async (req, res) => {
    try {
        const user_id = req.userId;

        if (!user_id) {
            return res.status(400).json({ message: 'User id is required' });
        }

        const response = await axios.get(`http://gateway:8080/api/users/${user_id}/following`);
        const friends_ids = response.data.following;

        if (!friends_ids || friends_ids.length === 0) {
            return res.status(404).json({ message: 'The user does not follow anyone' });
        }

        const feed = await Post.find().where('author').in(friends_ids).lean().exec();

            if(!feed){
                return res.status(204).json({ message: 'No feed available for user' });
            }

            return res.status(200).json({ feed : feed });

    } catch (err) {
        return res.status(500).json({ message: 'Unable to get user feed', details: err.message });
    }
    },

    createPost: async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const { content, tags, imageUrls, videoUrls } = req.body;

        // TODO : Check if the author is the same as the logged-in user
        // TODO : Validate the input data

        const newPost = new Post({
            author: user_id,
            content,
            tags,
            imageUrls,
            videoUrls
        });

        const savedPost = await newPost.save();

        // Appel au notification-service
        try {
            await axios.post('http://notification-service:3004/api/notifications/on-post-created', {
                userId: user_id, // L'utilisateur qui a créé le post
                postId: savedPost._id
            });
        } catch (notifyErr) {
            console.error('Failed to notify followers:', notifyErr.message);
            // Ne bloque pas la création du post en cas d'erreur de notif
        }

        return res.status(201).json(savedPost);

        } catch (err) {
            return res.status(500).json({ message: 'Failed to create post', details: err.message });
        }
    },

    updatePost: async (req, res) => {
        try{
            const postId = req.userId;
    
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
            const postId = req.userId;

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