const Buyer = require("../models/Buyer");
const Product = require("../models/Product");

// ✅ Fetch Buyer by Email (for authentication check)
const getBuyerByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const buyer = await Buyer.findOne({ email });

    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    res.status(200).json(buyer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buyer", error: error.message });
  }
};

// ✅ Add Item to Cart
const addToCart = async (req, res) => {
  try {
    const { buyerId, productId } = req.body;

    if (!buyerId || !productId) {
      return res.status(400).json({ message: "Buyer ID and Product ID are required" });
    }

    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingItem = buyer.cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      buyer.cart.push({
        productId: product.productId,
        name: product.name,
        imageUrl: product.imageId ? `http://localhost:5000/api/image/${product.imageId}` : "/placeholder.jpg",
        price: product.price,
        quantity: 1
      });
    }

    await buyer.save();
    res.status(200).json({ message: "Product added to cart", cart: buyer.cart });
  } catch (error) {
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// ✅ Get Cart Items
const getCartItems = async (req, res) => {
  try {
    const { buyerId } = req.params;
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    res.status(200).json(buyer.cart || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

// ✅ Remove Item from Cart
const removeFromCart = async (req, res) => {
  try {
    const { buyerId, productId } = req.body;
    const buyer = await Buyer.findById(buyerId);
    if (!buyer) return res.status(404).json({ message: "Buyer not found" });

    buyer.cart = buyer.cart.filter(item => item.productId !== productId);
    await buyer.save();

    res.status(200).json({ message: "Product removed from cart", cart: buyer.cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing from cart", error: error.message });
  }
};

module.exports = { getBuyerByEmail, addToCart, getCartItems, removeFromCart };
