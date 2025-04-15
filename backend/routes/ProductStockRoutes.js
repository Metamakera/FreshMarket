const express = require("express");
const { addStock, getStock, deleteStock } = require("../controllers/ProductStockController");

const router = express.Router();

// ✅ Change to POST since we're adding stock, not updating it
router.post("/add/:productId", addStock);

// ✅ Get Stock Details of a Product
router.get("/:productId", getStock);

// ✅ Delete Stock Entry (Optional)
router.delete("/delete/:productId", deleteStock);

module.exports = router;
