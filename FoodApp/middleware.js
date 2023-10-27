const expressError = require("./Utilities/ExpressError");
const { schemaValid, reviewSchema } = require("./schema");
const Recipe = require("./models/recipe");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Sign in to add new recipe");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateContent = (req, res, next) => {
  const { error } = schemaValid.validate(req.body);
  if (error) {
    const msg = error.details.map((er) => er.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((er) => er.message).join(",");
    throw new expressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const recipeScan = await Recipe.findById(id);
  if (!recipeScan.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/recipe/${id}`);
  }
  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that");
    return res.redirect(`/recipe/${id}`);
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
