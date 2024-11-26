const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken"); // For authentication
const bcrypt = require("bcrypt"); // For password hashing

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-Memory Data
const users = [];
const recipes = [];
const SECRET_KEY = "supersecretkey"; // Secret for signing JWTs

// Routes

// Register a new user
app.post("/auth/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find((user) => user.username === username || user.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = { id: users.length + 1, username, email, password: hashedPassword, favorites: [] };
  users.push(newUser);

  res.status(201).json({ success: true, message: "User registered successfully", user: { username, email } });
});

// Login a user
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  // Generate a JWT
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });

  res.json({ success: true, message: "Login successful", token });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access token required" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.user = user; // Attach user data to the request
    next();
  });
};

// Get current user's profile
app.get("/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  res.json({ success: true, user: { id: user.id, username: user.username, email: user.email, favorites: user.favorites } });
});

// Update current user's profile
app.put("/profile", authenticateToken, (req, res) => {
  const { username, email } = req.body;
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Update user's data
  if (username) user.username = username;
  if (email) user.email = email;

  res.json({ success: true, message: "Profile updated successfully", user: { username: user.username, email: user.email } });
});

// Recipes API with authentication

// Add a new recipe
app.post("/recipes", authenticateToken, (req, res) => {
  const newRecipe = {
    id: recipes.length + 1,
    userId: req.user.id, // Associate the recipe with the authenticated user
    title: req.body.title,
    description: req.body.description,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    category: req.body.category,
    prepTime: req.body.prepTime,
    difficulty: req.body.difficulty,
  };
  recipes.push(newRecipe);
  res.status(201).json({ success: true, message: "Recipe added successfully", data: newRecipe });
});

// Get all recipes
app.get("/recipes", (req, res) => {
  res.json({ success: true, data: recipes });
});

// Delete a recipe (only the creator can delete)
app.delete("/recipes/:id", authenticateToken, (req, res) => {
  const recipeIndex = recipes.findIndex((r) => r.id === parseInt(req.params.id) && r.userId === req.user.id);
  if (recipeIndex === -1) {
    return res.status(404).json({ success: false, message: "Recipe not found or not authorized" });
  }
  recipes.splice(recipeIndex, 1);
  res.json({ success: true, message: "Recipe deleted successfully" });
});

// Start the server
app.listen(port, () => {
  console.log(`Recipe Hub API is running at http://localhost:${port}`);
});
