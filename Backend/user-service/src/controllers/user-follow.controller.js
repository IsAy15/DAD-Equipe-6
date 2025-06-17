const User = require('../models/user.model');

// GET /api/users/:userId/followers
exports.getFollowers = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('followers', 'username email');
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ followers: user.followers });

    } catch (error) {
        console.error('Error in getFollowers:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /api/users/:userId/following
exports.getFollowing = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId).populate('following', 'username email');
        if (!user) {
        return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ following: user.following });

    } catch (error) {
        console.error('Error in getFollowing:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
