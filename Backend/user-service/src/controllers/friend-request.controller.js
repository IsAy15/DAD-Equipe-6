const FriendRequest = require('../models/friend-request.model');
const User = require('../models/user.model');

// POST /api/friend-requests/send/:receiverId
exports.sendFriendRequest = async (req, res) => {
    const senderId = req.userId;
    const receiverId = req.params.receiverId;

    if (senderId === receiverId) {
        return res.status(400).json({ message: "You can't send a friend request to yourself" });
    }

    try {
        // Vérifie que les deux utilisateurs existent
        const [sender, receiver] = await Promise.all([
        User.findById(senderId),
        User.findById(receiverId)
        ]);

        if (!sender || !receiver) {
        return res.status(404).json({ message: "User not found" });
        }

        // Vérifie si une demande existe déjà
        const existingRequest = await FriendRequest.findOne({
        sender: senderId,
        receiver: receiverId,
        status: 'pending'
        });

        if (existingRequest) {
        return res.status(400).json({ message: "Friend request already sent" });
        }

        // Crée la demande
        const newRequest = new FriendRequest({
        sender: senderId,
        receiver: receiverId
        });

        await newRequest.save();

        return res.status(201).json({ message: "Friend request sent", requestId: newRequest._id });

    } catch (err) {
        console.error("Error sending friend request:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// POST /api/friend-requests/:requestId/accept
exports.acceptFriendRequest = async (req, res) => {
    const userId = req.userId;
    const requestId = req.params.requestId;

    try {
        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        if (request.receiver.toString() !== userId) {
            return res.status(403).json({ message: "You are not authorized to accept this request" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "This request has already been handled" });
        }

        // Marquer la demande comme acceptée
        request.status = 'accepted';
        await request.save();

        // Récupérer les utilisateurs
        const [sender, receiver] = await Promise.all([
            User.findById(request.sender),
            User.findById(request.receiver)
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Sender or receiver not found" });
        }

        // Ajouter l'abonnement réciproque
        if (!sender.following.includes(receiver._id)) {
            sender.following.push(receiver._id);
            await sender.save();
        }

        if (!receiver.followers.includes(sender._id)) {
            receiver.followers.push(sender._id);
            await receiver.save();
        }

        return res.status(200).json({ message: "Friend request accepted" });

    } catch (err) {
        console.error("Error accepting friend request:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// POST /api/friend-requests/:requestId/refuse
exports.refuseFriendRequest = async (req, res) => {
    const userId = req.userId;
    const requestId = req.params.requestId;

    try {
        const request = await FriendRequest.findById(requestId);

        if (!request) {
        return res.status(404).json({ message: "Friend request not found" });
        }

        if (request.receiver.toString() !== userId) {
        return res.status(403).json({ message: "You are not authorized to refuse this request" });
        }

        if (request.status !== 'pending') {
        return res.status(400).json({ message: "This request has already been handled" });
        }

        request.status = 'refused';
        await request.save();

        return res.status(200).json({ message: "Friend request refused" });

    } catch (err) {
        console.error("Error refusing friend request:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/friend-requests/received
exports.getReceivedRequests = async (req, res) => {
    const userId = req.userId;

    try {
        const requests = await FriendRequest.find({
        receiver: userId,
        status: 'pending'
        }).populate('sender', 'username email');

        return res.status(200).json({ receivedRequests: requests });

    } catch (err) {
        console.error("Error fetching received requests:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// GET /api/friend-requests/sent
exports.getSentRequests = async (req, res) => {
    const userId = req.userId;

    try {
        const requests = await FriendRequest.find({
        sender: userId,
        status: 'pending'
        }).populate('receiver', 'username email');

        return res.status(200).json({ sentRequests: requests });

    } catch (err) {
        console.error("Error fetching sent requests:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


