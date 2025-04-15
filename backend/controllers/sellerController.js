const Seller = require("../models/Seller");
const nodemailer = require("nodemailer");
const Product = require("../models/Product"); // Adjust path as needed
const Buyer = require("../models/Buyer"); // Adjust path as needed

// Nodemailer Configuration (Ensure Correct Credentials)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "otpsharing2275@gmail.com", // Your Gmail
    pass: "iofj gmah euzt rpqe", // Your App Password (Generate from Google)
  },
  debug: true, // Enable debugging
});

// Function to generate unique seller ID
const generateSellerId = async () => {
  const count = await Seller.countDocuments();
  return `SEL${(count + 1).toString().padStart(5, "0")}`; // Generates like SEL00001
};

// ✅ Seller Signup & Send Email
const registerSeller = async (req, res) => {
  try {
    const { name, email, address, mobile, businessName, location, gstin, accDetails, panCardNumber } = req.body;

    // Check if email or mobile already exists
    const existingSeller = await Seller.findOne({ $or: [{ mobile }, { email }] });
    if (existingSeller) {
      return res.status(400).json({ message: "Seller with this email or mobile number already exists." });
    }

    // Generate Unique Seller ID
    const sellerId = await generateSellerId();

    // Create Seller
    const newSeller = new Seller({
      sellerId,
      name,
      email,
      address,
      mobile,
      businessName,
      location,
      gstin,
      accDetails,
      panCardNumber,
    });

    await newSeller.save();

    // ✅ Send Welcome Email with Seller ID
    const mailOptions = {
      from: "otpsharing2275@gmail.com",
      to: email,
      subject: "🎉 Welcome to BlueWave - Your Seller ID",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <table style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; border: 1px solid #ddd; padding: 20px;">
            <tr>
              <td style="text-align: center;">
                <h1 style="color: #007bff; margin-bottom: 10px;">Welcome, ${name}!</h1>
                <h3 style="color: #333;">Thank you for registering as a seller on <span style="color: blue;"><u>BlueWave</u></span>.</h3>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 15px 0;">
                <p style="font-size: 16px; color: #555;">Your unique <b>Seller ID</b> is:</p>
                <div style="background: yellow; padding: 12px 20px; display: inline-block; border-radius: 5px; font-size: 18px; font-weight: bold; color: blue;">
                  ${sellerId}
                </div>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding: 15px 0;">
                <p style="font-size: 14px; color: #555;">Use this Seller ID to log in to your dashboard and manage your products.</p>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; padding-top: 20px;">
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="font-size: 14px; color: #555;">Best Regards,</p>
                <p style="font-size: 16px; font-weight: bold; color: #007bff;">BlueWave Team</p>
              </td>
            </tr>
          </table>
        </div>
      `,
    };
    


    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
      } else {
        console.log("✅ Email sent successfully!", info.response);
      }
    });

    res.status(201).json({ message: "Seller registered successfully", seller: newSeller });

  } catch (error) {
    console.error("❌ Error registering seller:", error);
    res.status(500).json({ message: "Error registering seller", error: error.message });
  }
};
const Order = require('../models/Order');

// Fetch all productIds for a seller
const getSellerProductIds = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId });

    const productIds = products.map((p) => p.productId);
    res.status(200).json({ productIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product IDs' });
  }
};


// ✅ Get Orders for a Seller (Matching productId in buyer.myorders)
const getOrdersForSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;

    // 1️⃣ Fetch all products for the seller
    const sellerProducts = await Product.find({ sellerId });
    const sellerProductIds = sellerProducts.map(product => product.productId);

    // 2️⃣ Fetch all buyers
    const buyers = await Buyer.find();

    const matchingOrders = [];

    // 3️⃣ Iterate over buyers and their orders
    buyers.forEach((buyer) => {
      buyer.myorders.forEach((order) => {
        if (sellerProductIds.includes(order.productId)) {
          matchingOrders.push({
            buyerEmail: buyer.email,
            orderId: order.order_id,
            productId: order.productId,
            productName: order.product_name,
            quantity: order.product_quantity,
            paymentMethod: order.payment_method,
            address: order.address,
            district: order.district,
            place: order.place,
            pincode: order.pincode,
          });
        }
      });
    });

    res.status(200).json({ orders: matchingOrders });
  } catch (error) {
    console.error("❌ Error fetching seller orders:", error);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
};


module.exports = { registerSeller ,getSellerProductIds,getOrdersForSeller };
