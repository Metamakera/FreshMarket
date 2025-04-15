const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  productId: { type: String, required: true, unique: true },
  sellerId: { type: String, required: true }, // SellerId fetched from localStorage
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' } // Store image ID from GridFS
});

// Create a Product model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
