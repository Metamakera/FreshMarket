const mongoose = require("mongoose");

const customerOrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  district: { type: String, required: true },
  place: { type: String, required: true },
  pincode: { type: String, required: true },
  sellerId: { type: String, required: true }, // Store the seller's ID
  createdAt: { type: Date, default: Date.now }
});

const CustomerOrder = mongoose.model("CustomerOrder", customerOrderSchema);

module.exports = CustomerOrder;
