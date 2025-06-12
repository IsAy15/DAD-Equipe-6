const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require("../models/user.model");

exports.register = async (req, res) => {
  console.log("Received body:", req.body);
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      password: hashedPassword,
    });
    const accessToken = jwt.sign({ username: newUser.username, exp: Math.floor(Date.now() / 1000) + 120 }, process.env.ACCESS_JWT_KEY);
    await newUser.save();
    res.status(201).json({ msg: "New User created !", accessToken });
  } catch (err) {
    // Check if the error is due to a duplicate username
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username already exists" });
    }
    // Handle other errors
    console.error("Registration error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1. Chercher l'utilisateur en base
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // 2. Vérifier le mot de passe avec bcrypt
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const accessToken = jwt.sign({ username: user.username, exp: Math.floor(Date.now() / 1000) + 120 }, process.env.ACCESS_JWT_KEY);
    // 3. OK
    return res.status(200).json({ message: "You are now connected !", accessToken });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.authenticate = (req, res) => {
  let token = req.headers["authorization"];

 	// TO-DO : Le token est renvoyé avec le préfix « Bearer », stockez dans une variable seulement le token.
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
	//TO-DO : Faites les vérifications nécessaires.

  jwt.verify(token, process.env.ACCESS_JWT_KEY, (err, decoded) => {
    // TO-DO : Vérification si l’utilisateur décodé existe
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    // TO-DO : Renvoyer une réponse adaptée en fonction de son état
    return res.status(200).json({ message: "Authenticated successfully", user: decoded });
  });
};
