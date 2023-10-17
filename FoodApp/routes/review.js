const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { validateReview } = require("../middleware");

router.post(
  "/recipes/:id/reviews",
  validateReview,
  reviewController.review_post
);
router.delete("/recipes/:id/reviews/:reviewId", reviewController.review_delete);
module.exports = router;
