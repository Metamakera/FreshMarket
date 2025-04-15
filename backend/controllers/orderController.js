const Order = require("../models/Order");

// ✅ Function to Generate a Unique Order ID
const generateOrderId = () => {
    return `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// ✅ Place Order (Buyer)
const placeOrder = async (req, res) => {
    try {
        const orderId = generateOrderId(); // Generate unique order ID
        const newOrder = new Order({
            orderId: orderId,  
            productId: req.body.productId,  // ✅ Keep productId as a string
            buyerEmail: req.body.buyerEmail,
            quantity: req.body.quantity,
            totalPrice: req.body.totalPrice,
            address: req.body.address,
            paymentMethod: req.body.paymentMethod,
            status: "Pending", // Default status
        });

        await newOrder.save();

        res.status(201).json({ message: "Order placed successfully", orderId });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Server error!", error: error.message });
    }
};

// ✅ Get All Orders for a Buyer
const getBuyerOrders = async (req, res) => {
    try {
        const { buyerEmail } = req.params;  // ✅ Fetch orders by buyerEmail
        const orders = await Order.find({ buyerEmail }).sort({ createdAt: -1 });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching buyer orders:", error);
        res.status(500).json({ message: "Server error!", error: error.message });
    }
};

// ✅ Get All Orders for a Seller (Filtering by productId Prefix)
const getSellerOrders = async (req, res) => {
    try {
        const { sellerPrefix } = req.params; // Example: "F-01"
        
        // ✅ Fetch all orders where productId starts with sellerPrefix (like "F-01")
        const orders = await Order.find({ productId: new RegExp(`^${sellerPrefix}`) });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).json({ message: "Server error!", error: error.message });
    }
};

// ✅ Update Order Status (Seller Updates)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["Processing", "Shipped", "Delivered", "Completed"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status update!" });
        }

        const updatedOrder = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found!" });
        }

        res.status(200).json({ message: "Order status updated!", order: updatedOrder });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Server error!", error: error.message });
    }
};

// ✅ Fetch Orders for a Seller by Product ID
const getOrdersByProductId = async (req, res) => {
    try {
        const { productId } = req.params;
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const orders = await Order.find({ productId }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this product." });
        }

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching orders by product ID:", error);
        res.status(500).json({ message: "Server error!" });
    }
};

module.exports = { placeOrder, getBuyerOrders, getSellerOrders, updateOrderStatus, getOrdersByProductId };
