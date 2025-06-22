const FriendRequest = require('../models/friend-request.model');
const User = require('../models/user.model');

// POST /api/follow/:targetUserId
exports.followUser = async (req, res) => {
    const followerId = req.userId;
    const targetUserId = req.params.targetUserId;

    if (followerId === targetUserId) {
        return res.status(400).json({ message: "You can't follow yourself" });
    }

    try {
        const [follower, targetUser] = await Promise.all([
            User.findById(followerId),
            User.findById(targetUserId)
        ]);

        if (!follower || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (follower.following.includes(targetUserId)) {
            return res.status(400).json({ message: "You are already following this user" });
        }

        follower.following.push(targetUserId);
        targetUser.followers.push(followerId);

        await Promise.all([follower.save(), targetUser.save()]);

        return res.status(200).json({ message: "User followed successfully" });
    } catch (err) {
        console.error("Error following user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/unfollow/:targetUserId
exports.unfollowUser = async (req, res) => {
    const followerId = req.userId;
    const targetUserId = req.params.targetUserId;

    try {
        const [follower, targetUser] = await Promise.all([
            User.findById(followerId),
            User.findById(targetUserId)
        ]);

        if (!follower || !targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        follower.following = follower.following.filter(id => id.toString() !== targetUserId);
        targetUser.followers = targetUser.followers.filter(id => id.toString() !== followerId);

        await Promise.all([follower.save(), targetUser.save()]);

        return res.status(200).json({ message: "User unfollowed successfully" });
    } catch (err) {
        console.error("Error unfollowing user:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

