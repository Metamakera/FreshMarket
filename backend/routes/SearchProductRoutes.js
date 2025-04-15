const express = require("express");
const { getProductsByCategory, getImageById } = require("../controllers/SearchProductController");

const router = express.Router();

// ✅ Fix API path: Fetch Products by Category ID (e.g., "F-01")
router.get("/searchproduct/category/:categoryId", getProductsByCategory);

// ✅ Fetch Image by ID
router.get("/searchproduct/image/:id", getImageById);

module.exports = router;
