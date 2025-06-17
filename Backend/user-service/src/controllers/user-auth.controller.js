const User = require('../models/user.model');

// Contrôleur pour /auth-data
exports.getAuthData = async (req, res) => {
    const identifier = req.query.identifier;

    if (!identifier) {
        return res.status(400).json({ error: 'Missing identifier (email or username)' });
    }

    try {
        const user = await User.findOne({
        $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json({
        id: user._id,
        email: user.email,
        username: user.username,
        hashedPassword: user.password
        });

    } catch (err) {
        console.error('Error in /auth-data:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Contrôleur pour POST /api/users
exports.createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
        }

        const newUser = new User({ username, email, password, role: role || 'user' });
        await newUser.save();

        return res.status(201).json({ message: "User created successfully" });

    } catch (err) {
        if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({ error: `${field} already exists` });
        }

        console.error("Error creating user:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
