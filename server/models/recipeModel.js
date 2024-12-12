const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  images: { type: [String] }, // URLs or file paths
  categoryTags: { type: [String] },
  mealType: {type: String},
  preparationTime: { type: Number, required: true }, // In minutes
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;