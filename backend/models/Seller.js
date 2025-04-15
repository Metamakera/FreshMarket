const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  sellerId: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  businessName: { type: String, required: true },
  location: { type: String, required: true },
  gstin: { type: String, required: true, unique: true },
  accDetails: { type: String, required: true },
  panCardNumber: { type: String, required: true, unique: true },
  imageId: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" } // ✅ Store image ID from GridFS
});

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
