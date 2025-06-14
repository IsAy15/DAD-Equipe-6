const Post = require('../models/post.model');

module.exports = {

    getPostsByUserId: (req, res) => {
        // Controller logic to retrieve posts by user id goes here
        const user_id = req.params.user_id;

        if(!user_id) {
            return res.status(400).json({ message: 'User id is required' });
        }

        const posts = Post.find({ author: user_id });

        if(posts) {
            return res.status(200).json(posts);
        }

        return res.status(404).json({ message: 'No posts found for this user' });

    },
    getPostsOfSubscribdedTo: (req, res) => {
        // Controller logic to retrieve posts of subscribed users goes here
    },
    createPost: (req, res) => {
        // Controller logic to create a new post goes here
        const { user_id, content, tags, imageUrls, videoUrls } = req.body;

        //TODO : Validate the input data

        const newPost = new Post({user_id,
                                content,
                                tags,
                                imageUrls,
                                videoUrls
        });     

        newPost.save()
            .then(post => res.status(201).json(post))
            .catch(err => res.status(500).json({ message: 'Failed to create post', details: err.message }));

    },
    updatePost: async (req, res) => {
        const postId = req.params.post_id;

        if(!postId) {
            return res.status(400).json({ message: 'Post id is required' });
        }
        
        const { content, tags, imageUrls, videoUrls } = req.body;
        
        await Post.findByIdAndUpdate(
            postId, 
            {
                content,
                tags,
                imageUrls,
                videoUrls
            },
            { new: true },
            function(err, post) {
                if(err) {
                    return res.status(500).json({ message: 'Failed to update post', details: err.message });
                }
                if(!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return res.status(200).json({ message: 'Post updated successfully', post });
            }
        ).exec();
    },

    deletePost: (req, res) => {
       const postId = req.params.post_id;

        if(!postId) {
            return res.status(400).json({ message: 'Post id is required' });
        }

        Post.findByIdAndDelete(postId)
            .then(post => {
                if(!post) {
                    return res.status(404).json({ message: 'Post not found' });
                }
                return res.status(201).json({ message: 'Post deleted successfully' });
            })
            .catch(err => res.status(500).json({ message: 'Failed to delete post', details: err.message }));
    },
}