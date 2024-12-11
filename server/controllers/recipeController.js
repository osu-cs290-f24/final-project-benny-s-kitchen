const Recipe = require('../models/recipeModel');

// Create a new recipe
const createRecipe = async (req, res) => {
  console.log(`=== POST received\n${JSON.stringify(req.body)}`)
  const recipeData = req.body;
  try {
    if ((recipeData["recipeList"]) && Array.isArray(recipeData["recipeList"]) && (recipeData["recipeList"].length > 0)) {
      //console.log("Recipe list received\n");
      let recipeList = recipeData["recipeList"];
      //console.log(recipeList);
      let newRecipes = await Recipe.create(recipeList);
      res.status(201).json({ message: 'Recipe created successfully!', recipe: newRecipes });
    }
    else {
      let newRecipe = await Recipe.create(recipeData);
      res.status(201).json({ message: 'Recipe created successfully!', recipe: newRecipe });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error: error.message });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error: error.message });
  }
};

// Get a single recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipe', error: error.message });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    console.log(`=== PUT received: ${id}`);
    console.log(updatedData);
    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe updated successfully', recipe: updatedRecipe });
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error: error.message });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecipe = await Recipe.findByIdAndDelete(id);
    if (!deletedRecipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error: error.message });
  }
};

const filterRecipe = async(req, res, next) => {
  const { title, category, mealType } = req.query;
  const filter = {};

  // Filter by title if provided
  // Using a regex for case-insensitive partial matching
  if (title) {
      filter.title = new RegExp(title, 'i');
  }

  if (mealType) {
    filter.mealType = mealType;
  }

  // Filter by category if provided
  // Assuming categoryTags is an array field, we can use $in
  if (category) {
      filter.categoryTags = { $in: [category] };
  }

  // Attach the filter object to the request for later use
  req.recipeFilter = filter;
  next();
}

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
};