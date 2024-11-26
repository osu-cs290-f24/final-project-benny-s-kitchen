const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  hashedPassword: { type: String, required: true },
  favorites: { type: [String] },
  createdRecipes: { type: [String] }
}, { timestamps: true });

const User = mongoose.model('User', recipeSchema);

module.exports = User;