const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const expressError = require("../Utilities/ExpressError");

exports.index_page = asyncHandler(async (req, res) => {
  const recipes = await Recipe.find();
  res.render("recipe/index", { recipes });
});

exports.new_recipe_get = asyncHandler((req, res) => {
  res.render("recipe/new");
});

exports.new_recipe_post = asyncHandler(async (req, res) => {
  if (!req.body.recipe) throw new expressError("Invalid Recipe Data", 400);
  const recipe = new Recipe(req.body.recipe);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
});

exports.recipe_show = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate("reviews");
  res.render("recipe/show", { recipe });
});

exports.recipe_edit_get = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render("recipe/edit", { recipe });
});

exports.recipe_edit_put = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findByIdAndUpdate(id, {
    ...req.body.recipe,
  });
  res.redirect(`/recipes/${recipe._id}`);
});

exports.recipe_delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  res.redirect("/recipes");
});
