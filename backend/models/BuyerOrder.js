const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order_id: String,
  product_name: String,
  product_quantity: Number,
  productId: String,
  payment_method: String,
  district: String,
  place: String,
  address: String,
  pincode: String,
  status: { type: String, default: "Pending" }
});

const buyerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cart: [],
  myorders: [orderSchema],
}, { timestamps: true });

// ✅ Avoid OverwriteModelError + target existing "buyer" collection
const BuyerOrder = mongoose.models.BuyerOrder || mongoose.model("BuyerOrder", buyerSchema, "buyers");

module.exports = BuyerOrder;
