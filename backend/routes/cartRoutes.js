const express = require("express");
const { getBuyerByEmail, addToCart, getCartItems, removeFromCart } = require("../controllers/cartControllers");

const router = express.Router();

router.get("/buyer/email/:email", getBuyerByEmail); // ✅ Fetch Buyer using Email
router.post("/add", addToCart); // ✅ Add item to Cart
router.get("/:buyerId", getCartItems); // ✅ Get Cart Items
router.delete("/remove", removeFromCart); // ✅ Remove item from Cart

module.exports = router;
