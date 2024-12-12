const express = require("express");
var exphbs = require('express-handlebars')

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONNECTION_STRING).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const recipeRoutes = require('./routes/recipeRoutes');
const userRoutes = require('./routes/userRoutes');
const Recipe = require("./models/recipeModel");

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('../static'))

app.use("/recipes", recipeRoutes);
app.use("/users", userRoutes);

app.get('/', async function (req, res, next) {
  const recipes = await Recipe.find().lean();
  console.log(recipes);
  res.status(200).render('recipePage', {
    renderAll: true,
    recipes: recipes
  })
})

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
