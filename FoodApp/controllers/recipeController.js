const Recipe = require("../models/recipe");
const asyncHandler = require("express-async-handler");
const expressError = require("../Utilities/ExpressError");
const { cloudinary } = require("../cloudinary");
// recipe;
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
  recipe.images = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  recipe.author = req.user._id;
  await recipe.save();
  console.log(recipe);
  req.flash("success", "Successfully made new recipe");
  res.redirect(`/recipes/${recipe._id}`);
});

exports.recipe_show = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!recipe) {
    req.flash("error", "Sorry that recipe isn't here");
    return res.redirect("/recipes");
  }
  res.render("recipe/show", { recipe });
});

exports.recipe_edit_get = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash("error", "Sorry that recipe isn't here");
    return res.redirect("/recipe");
  }
  res.render("recipe/edit", { recipe });
});

exports.recipe_edit_put = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const recipe = await Recipe.findByIdAndUpdate(id, {
    ...req.body.recipe,
  });
  const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  recipe.images.push(...imgs);
  // //Once working test without await recipe.save()
  await recipe.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await recipe.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(recipe);
  }
  req.flash("success", "Your recipe has been updated");
  res.redirect(`/recipes/${recipe._id}`);
});

exports.recipe_delete = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  req.flash("success", "Your recipe has been deleted");
  res.redirect("/recipes");
});
