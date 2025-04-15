const BuyerOrder = require("../models/BuyerOrder");

// 1️⃣ Get all orders for a buyer by email
const getMyOrdersByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const buyer = await BuyerOrder.findOne({ email });

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    res.status(200).json({ myorders: buyer.myorders });
  } catch (error) {
    console.error("❌ Error fetching myorders:", error);
    res.status(500).json({ message: "Error fetching myorders" });
  }
};

// 2️⃣ Get all productIds from the buyer's orders
const getAllProductIdsFromOrders = async (req, res) => {
    try {
      // Fetch all buyers' myorders data
      const buyers = await BuyerOrder.find({});
  
      // If no buyers exist
      if (!buyers || buyers.length === 0) {
        return res.status(404).json({ message: "No buyers found" });
      }
  
      // Extract product IDs from all buyers' myorders
      const productIds = [];
      buyers.forEach(buyer => {
        buyer.myorders.forEach(order => {
          productIds.push(order.productId);
        });
      });
  
      res.status(200).json({ productIds });
    } catch (error) {
      console.error("❌ Error fetching all product IDs:", error);
      res.status(500).json({ message: "Error fetching all product IDs" });
    }
  };
  

// 3️⃣ Update a specific order's status
const updateOrderStatus = async (req, res) => {
  try {
    const { email, orderId } = req.params;
    const { status } = req.body;

    const buyer = await BuyerOrder.findOne({ email });
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    const order = buyer.myorders.find(order => order.order_id === orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await buyer.save();

    res.status(200).json({ message: "Order status updated", updatedOrder: order });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
const getOrdersByProductId = async (req, res) => {
    try {
      const { productId } = req.params;
  
      // Fetch all buyers who have this productId in any of their orders
      const buyers = await BuyerOrder.find({ "myorders.productId": productId });
  
      if (!buyers || buyers.length === 0) {
        return res.status(404).json({ message: "No orders found for this product" });
      }
  
      const orders = [];
      buyers.forEach(buyer => {
        buyer.myorders.forEach(order => {
          if (order.productId === productId) {
            orders.push({
              order_id: order.order_id,
              product_name: order.product_name,
              product_quantity: order.product_quantity,
              payment_method: order.payment_method,
              district: order.district,
              place: order.place,
              address: order.address,
              pincode: order.pincode,
              buyer_email: buyer.email,
              order_date: buyer.createdAt,
              status: order.status || "Pending" // ✅ Include order status
            });
          }
        });
      });
  
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this product" });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error("❌ Error fetching orders by productId:", error);
      res.status(500).json({ message: "Error fetching orders by productId" });
    }
  };
  
module.exports = {
  getMyOrdersByEmail,
  getAllProductIdsFromOrders,
  updateOrderStatus,
  getOrdersByProductId
};
