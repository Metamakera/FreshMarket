const mongoose = require("mongoose");

const productStockSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  stockQuantity: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const ProductStock = mongoose.model("ProductStock", productStockSchema);
module.exports = ProductStock;
