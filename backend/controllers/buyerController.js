const Buyer = require("../models/Buyer");

// ✅ Register Buyer
exports.registerBuyer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if buyer already exists
    const existingBuyer = await Buyer.findOne({ email });
    if (existingBuyer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new buyer (No password encryption)
    const newBuyer = new Buyer({ name, email, password });
    await newBuyer.save();

    res.status(201).json({ message: "Buyer registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Login Buyer
exports.loginBuyer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if buyer exists
    const buyer = await Buyer.findOne({ email });
    if (!buyer || buyer.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ✅ Send buyer details (No JWT, No encryption)
    res.json({ 
      message: "Login successful", 
      buyer: { name: buyer.name, email: buyer.email, password: buyer.password }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.addOrderToMyOrders = async (req, res) => {
  try {
    const { email, order_id, product_name, product_quantity, productId, payment_method, district, place, address, pincode } = req.body;

    // Log the request body to check if productId is being sent
    console.log('Incoming Request Body:', req.body);  // Log the incoming request body for debugging

    // Ensure productId exists and is a string
    if (!productId || typeof productId !== 'string') {
      return res.status(400).json({ message: "Invalid productId" });
    }

    // Find the buyer by email
    const buyer = await Buyer.findOne({ email });
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }

    // Create new order object with productId checked
    const newOrder = {
      order_id,
      product_name,
      product_quantity,
      productId,  // Ensure productId is passed correctly
      payment_method,
      district,
      place,
      address,
      pincode
    };

    // Log the newOrder to make sure it's correct before saving
    console.log('New Order:', newOrder);

    // Log current buyer's orders before pushing the new order
    console.log('Buyer MyOrders before push:', buyer.myorders);

    // Add new order to myorders array
    buyer.myorders.push(newOrder);

    // Log the myorders array after the new order is pushed
    console.log('Buyer MyOrders after push:', buyer.myorders);

    // Save the updated buyer with the new order
    const updatedBuyer = await buyer.save();

    // Respond with success
    res.status(201).json({ message: "Order added successfully", myorders: updatedBuyer.myorders });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


