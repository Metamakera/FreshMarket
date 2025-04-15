const express = require("express");
const {
  getMyOrdersByEmail,
  getAllProductIdsFromOrders,
  updateOrderStatus,
  getOrdersByProductId
} = require("../controllers/buyerOrderController");

const router = express.Router();

// 1️⃣ Get all myorders by email
router.get("/orders/:email", getMyOrdersByEmail);

// 2️⃣ Get productIds from myorders
router.get("/product-ids", getAllProductIdsFromOrders);

// 3️⃣ Update order status (e.g., approve, cancel)
router.put("/orders/:email/:orderId/status", updateOrderStatus);

router.get('/orders/product/:productId', getOrdersByProductId);

module.exports = router;

