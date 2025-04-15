const express = require("express");
const { registerBuyer, loginBuyer,addOrderToMyOrders } = require("../controllers/buyerController");

const router = express.Router();

// ✅ Register Route
router.post("/register", registerBuyer);

// ✅ Login Route
router.post("/login", loginBuyer);

router.post("/addOrder", addOrderToMyOrders);

module.exports = router;
