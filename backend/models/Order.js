const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  email: String,
  order_id: String,
  product_name: String,
  product_quantity: Number,
  productId: { type: String, required: true },
  payment_method: String,
  district: String,
  place: String,
  address: String,
  pincode: String,
});

module.exports = mongoose.model('Order', orderSchema);
