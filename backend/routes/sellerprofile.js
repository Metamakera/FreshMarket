const express = require("express");
const { getAllSellerIds, getSellerById } = require("../controllers/sellerprofile");

const router = express.Router();

// ✅ Route to fetch all Seller IDs
router.get("/seller-ids", getAllSellerIds);

// ✅ Route to fetch Seller details by Seller ID
router.get("/:sellerId", getSellerById);

module.exports = router;
