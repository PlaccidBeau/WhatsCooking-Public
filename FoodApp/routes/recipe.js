const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

router.get("/", recipeController.index_page);

router.get("/new", recipeController.new_recipe_get);

router.post("/new", recipeController.new_recipe_post);

router.get("/:id", recipeController.recipe_show);

router.get("/:id/edit", recipeController.recipe_edit_get);

router.put("/:id", recipeController.recipe_edit_put);

router.delete("/:id", recipeController.recipe_delete);

module.exports = router;
