const User = require('../models/userModel');
const jwt = require("jsonwebtoken"); // For authentication
const bcrypt = require("bcrypt"); // For password hashing

const SECRET_KEY = process.env.SECRET_KEY;
const allowedUpdates = ["email", "hashedPassword"];

// Create a new recipe
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Register User: ${username} | ${email} | ${password}\n`);
  try {
    const existingUser = await User.exists({username: username}).or({email: email});
    if (existingUser) {
      res.status(400).json({message: "User already exists"});
    }
    else {
      const newUser = new User({
        username: username,
        email: email,
        hashedPassword: password
      })
      const validateErr = newUser.validateSync();
      if (validateErr) {
        res.status(400).json({message: "Error registering user", error: validateErr.message});
      }
      else {
        let hashedPassword = "";
        try {
          hashedPassword = await bcrypt.hash(password, 10);
        } catch (hashErr) {
          res.status(500).json({message: "Bcrypt error", error: hashErr});
          return;
        }
        newUser.hashedPassword = hashedPassword;
        await newUser.save();
        res.status(200).json({message: "User created"});
      }
    }
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    req.user = user; // Attach user data to the request
    next();
  });
};

const loginUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log(`Login user: ${username} | ${email} | ${password}`);
  let user = null;
  if (username) {
    user = await User.findOne({username: username}).exec();
  }
  else if (email) {
    user = await User.findOne({email: email}).exec();
  }

  if (!user) {
    res.status(401).json({ message: "User not found" });
    return;
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
  if (!isPasswordValid) {
    res.status(401).json({ message: "Password doesn't match" });
    return;
  }

  // Generate a JWT
  const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

  res.status(200).json({ message: "Login successful", token });
};

const getUserProfile = async (req, res) => {
  const { username, email, password } = req.user;
  console.log(`Get user profile: ${username} | ${email} | ${password}`);
  if (!username) {
    res.status(400).json({message: "Bad request: Username missing"});
    return
  }
  const user = await User.findOne({username: username}).exec();
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }
  res.status(200).json({ user: { id: user._id, username: user.username, email: user.email, favorites: user.favorites } });
};

const updateUserProfile = async (req, res) => {
  const { id, username} = req.user;
  const { email, hashedPassword } = req.body;
  
  console.log(`Update user: ${id} | ${username} | ${email} | ${hashedPassword}`);

  let requestedUpdates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field]) {
      requestedUpdates[field] = req.body[field];
    }
  });
  if (requestedUpdates.hashedPassword) {
    let hashedPassword = requestedUpdates.hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(hashedPassword, 10);
      requestedUpdates.hashedPassword = hashedPassword;
    } catch (hashErr) {
      res.status(500).json({message: "Bcrypt error", error: hashErr.message});
      return;
    }
  }
  console.log(JSON.stringify(requestedUpdates));
  try
  {
    const updatedUser = await User.findByIdAndUpdate(id, requestedUpdates, {new: true});
    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json({ message: "Profile updated successfully", user: { username: updatedUser.username, email: updatedUser.email } });
  } catch (updateErr) {
    res.status(500).json({ message: "Error updating user", error: updateErr.message });
    return;
  }
};

module.exports = {
  registerUser,
  loginUser,
  authenticateToken,
  getUserProfile,
  updateUserProfile
};