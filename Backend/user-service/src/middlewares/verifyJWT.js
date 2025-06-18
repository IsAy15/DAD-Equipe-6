const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Vérifie si le header existe et commence par 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_JWT_KEY);

        // Stocke l'ID de l'utilisateur dans la requête
        req.userId = decoded.userId;

        next(); // Passe au contrôleur suivant
    } catch (err) {
        console.error("JWT error:", err);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
