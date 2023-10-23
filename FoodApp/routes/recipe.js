const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor, validateContent } = require("../middleware");
const recipeController = require("../controllers/recipeController");
const { storage } = require("../cloudinary");
const multer = require("multer");
const upload = multer({ storage });
const asyncHandler = require("express-async-handler");

router.route("/").get(asyncHandler(recipeController.index_page));

router
  .route("/new")
  .get(isLoggedIn, recipeController.new_recipe_get)
  .post(
    isLoggedIn,
    upload.array("recipe[image]"),
    validateContent,
    recipeController.new_recipe_post
  );
router
  .route("/:id")
  .get(recipeController.recipe_show)
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("recipe[image]"),
    validateContent,
    recipeController.recipe_edit_put
  );

router
  .route("/:id/edit")
  .get(isLoggedIn, isAuthor, recipeController.recipe_edit_get);

router
  .route("/:id")
  .delete(isLoggedIn, isAuthor, recipeController.recipe_delete);

module.exports = router;
