const mongoose = require("mongoose");
// const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const RecipeSchema = new Schema({
  title: String,
  ingredients: String,
  directions: String,
  description: String,
});

module.exports = mongoose.model("Recipe", RecipeSchema);
