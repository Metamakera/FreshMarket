const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    enum: [
      "Chef's Recipes",
      "How to Clean & Prep Seafood",
      "Cooking Times by Species",
      "Seasonal Specials"
    ],
    required: true,
  },
  description: { type: String, required: true },
  productName: { type: String, required: true },  // Add productName field here
  imageUrl: String,
  ingredients: [String],
  steps: [String],
  createdBy: {
    sellerId: { type: String, required: true },
    sellerName: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Recipe", recipeSchema);
