const mongoose = require("mongoose");

const BuyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { type: String, required: true },  // This should be a string
      name: String,
      imageUrl: String,
      price: Number,
      quantity: { type: Number, default: 1 }
    }
  ],
  myorders: [
    {
      order_id: { type: String, required: true },
      product_name: { type: String, required: true },
      product_quantity: { type: Number, required: true },
      productId: { type: String, required: true },  // Ensure this is a string and required
      payment_method: { type: String, required: true },
      district: { type: String, required: true },
      place: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true }
    }
  ]
  ,
  createdAt: { type: Date, default: Date.now }
});

const Buyer = mongoose.model("Buyer", BuyerSchema);
module.exports = Buyer;
