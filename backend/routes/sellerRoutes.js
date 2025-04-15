const express = require("express");
const { registerSeller ,getOrdersForSeller,getSellerProductIds} = require("../controllers/sellerController");

const router = express.Router();

// Route for Seller Signup
router.post("/signup", registerSeller);
router.get('/seller-products/:sellerId', getSellerProductIds);
router.get('/orders/:sellerId', getOrdersForSeller);
module.exports = router;
