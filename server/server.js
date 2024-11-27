const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/recipe-hub').then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-Memory Data
const users = [];
const recipes = [];
const SECRET_KEY = "supersecretkey"; // Secret for signing JWTs

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');

app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
