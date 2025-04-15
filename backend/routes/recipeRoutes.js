const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

// Create recipe (without video)
router.post("/", recipeController.createRecipe);

// Get all recipes or by category
router.get("/", recipeController.getRecipes);

// Get a recipe by ID
router.get("/category/:category", recipeController.getRecipesByCategory);

// Update a recipe by ID
router.put("/:id", recipeController.updateRecipe);

// Delete a recipe by ID
router.delete("/:id", recipeController.deleteRecipe);

router.get("/seller/:sellerId", recipeController.getRecipesBySellerId);


module.exports = router;
