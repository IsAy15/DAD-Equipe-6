const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');

exports.register = async (req, res) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const userPayload = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: 'user'
    };

    const userServiceURL = process.env.USER_SERVICE_URL;
    const { data: user } = await axios.post(`${userServiceURL}/api/users`, userPayload, { timeout: 3000 });

    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 600
      },
      process.env.ACCESS_JWT_KEY
    );

    return res.status(201).json({ msg: "New User created!", accessToken });

  } catch (err) {
    if (err.response) {
      console.error("user-service responded with:", err.response.status, err.response.data);
      return res.status(err.response.status).json({
        error: err.response.data.error || "user-service rejected the request"
      });
    } else {
      console.error("user-service unreachable:", err.message);
      return res.status(500).json({ error: "user-service unreachable" });
    }
  }
};


// LOGIN : demande les données à user-service
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    console.log("🔍 Login request body:", req.body);

    if (!identifier || !password) {
      return res.status(400).json({ message: "Missing identifier or password" });
    }

    // Appel au user-service pour récupérer les données
    const userServiceURL = process.env.USER_SERVICE_URL;
    const { data: user } = await axios.get(`${userServiceURL}/api/users/auth-data`, {
      params: { identifier }
    });

    const isPasswordValid = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        exp: Math.floor(Date.now() / 1000) + 600
      },
      process.env.ACCESS_JWT_KEY
    );

    return res.status(200).json({ message: "You are now connected!", accessToken, userId: user.id });

  } catch (err) {
    if (err.response && err.response.status === 404) {
      return res.status(401).json({ message: "Invalid email/username or password" });
    }
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// AUTHENTICATE
exports.authenticate = (req, res) => {
  let token = req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  } else {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.ACCESS_JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ message: "Authenticated successfully", user: decoded });
  });
};
