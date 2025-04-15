const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ✅ Place Order
router.post("/place-order", orderController.placeOrder);

// ✅ Get Orders of a Buyer
router.get("/buyer/:buyerEmail", orderController.getBuyerOrders);

// ✅ Get Orders of a Seller (Filtering by product prefix like "F-01")
router.get("/seller/:sellerPrefix", orderController.getSellerOrders);

// ✅ Update Order Status
router.put("/update-status/:orderId", orderController.updateOrderStatus);

router.get("/seller/orders/:productId", orderController.getOrdersByProductId);

module.exports = router;
