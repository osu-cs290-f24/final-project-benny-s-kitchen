const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  favorites: { type: [String] },
  createdRecipes: { type: [String] }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;