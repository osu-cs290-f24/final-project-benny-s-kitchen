const User = require('../models/userModel');

// Create a new recipe
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.exists({name: username}).or({email: email});
    if (existingUser) {
      res.status(400).json({message: "User already exists"});
    }
    else {
      res.status(200).json({message: "User created"});
    }
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error: error.message });
  }
};

module.exports = {
  registerUser,
};