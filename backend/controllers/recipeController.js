const Recipe = require("../models/Recipe");

exports.createRecipe = async (req, res) => {
    try {
      const { title, category, description, ingredients, steps, createdBy, productName } = req.body;
  
      // Validate ingredients and steps fields
      if (!ingredients || !steps) {
        return res.status(400).json({ message: "Ingredients and steps are required" });
      }
  
      // If ingredients or steps are strings, split them into arrays
      const recipeData = {
        title,
        category,
        description,
        productName,
        ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(","),
        steps: Array.isArray(steps) ? steps : steps.split(","),
        createdBy: {
          sellerId: createdBy.sellerId,
          sellerName: createdBy.sellerName,
        },
      };
  
      const newRecipe = new Recipe(recipeData);
      await newRecipe.save();
  
      res.status(201).json({ message: "Recipe created successfully" });
    } catch (error) {
      console.error("Error creating recipe:", error);  // Log the error for debugging
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
// Fetch all recipes or by category
exports.getRecipes = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const recipes = await Recipe.find(query).populate("createdBy");
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch a single recipe by ID
// Fetch recipes by category
exports.getRecipesByCategory = async (req, res) => {
    try {
      const { category } = req.params;  // Get category from route parameter
  
      // Find recipes by category
      const recipes = await Recipe.find({ category }).populate("createdBy");
  
      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found in this category" });
      }
  
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Update a recipe by ID
exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a recipe by ID
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Fetch recipes by sellerId
exports.getRecipesBySellerId = async (req, res) => {
    try {
      const { sellerId } = req.params;  // Get sellerId from route parameter
  
      // Find recipes by sellerId
      const recipes = await Recipe.find({ "createdBy.sellerId": sellerId }).populate("createdBy");
      
      if (recipes.length === 0) {
        return res.status(404).json({ message: "No recipes found for this seller" });
      }
  
      res.status(200).json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  