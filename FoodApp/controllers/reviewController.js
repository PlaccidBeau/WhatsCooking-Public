const Recipe = require("../models/recipe");
const Review = require("../models/review");
const asyncHandler = require("express-async-handler");

exports.review_post = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  recipe.reviews.push(review);
  await review.save();
  await recipe.save();
  req.flash("success", "Review has been posted!");
  res.redirect(`/recipes/${recipe._id}`);
});

exports.review_delete = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;
  await Recipe.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review has been deleted!");
  res.redirect(`/recipes/${id}`);
});
