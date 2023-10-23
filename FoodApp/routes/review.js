const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/recipes/:id/reviews",
  isLoggedIn,
  validateReview,
  reviewController.review_post
);
router.delete(
  "/recipes/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewController.review_delete
);
module.exports = router;
