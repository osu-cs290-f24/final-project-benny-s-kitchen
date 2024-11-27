const User = require('../models/userModel');
const jwt = require("jsonwebtoken"); // For authentication
const bcrypt = require("bcrypt"); // For password hashing

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

module.exports = {
  registerUser,
};