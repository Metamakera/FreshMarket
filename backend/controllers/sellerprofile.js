const Seller = require("../models/Seller");

// ✅ Fetch all Seller IDs
exports.getAllSellerIds = async (req, res) => {
  try {
    const sellers = await Seller.find({}, "sellerId"); // Fetch only sellerId
    res.status(200).json({ sellerIds: sellers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller IDs", error: error.message });
  }
};

// ✅ Fetch Seller Details by Seller ID
exports.getSellerById = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const seller = await Seller.findOne({ sellerId });

    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    res.status(200).json({ seller });
  } catch (error) {
    res.status(500).json({ message: "Error fetching seller details", error: error.message });
  }
};
