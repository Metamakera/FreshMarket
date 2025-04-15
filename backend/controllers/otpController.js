const Seller = require("../models/Seller");
const Otp = require("../models/Otp");
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "otpsharing2275@gmail.com", // System email
    pass: "iofj gmah euzt rpqe", // App password
  },
});

// ✅ Generate OTP & Send Email
exports.sendOtp = async (req, res) => {
  try {
    const { sellerId } = req.body;

    // Check if seller exists
    const seller = await Seller.findOne({ sellerId });
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    const email = seller.email;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

    // 🔹 Delete any existing OTP before saving a new one
    await Otp.deleteOne({ email });

    // 🔹 Save new OTP with expiration
    const newOtp = new Otp({ email, otp });
    await newOtp.save();

    // Send OTP Email
    const mailOptions = {
      from: "otpsharing2275@gmail.com",
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully", email });

  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Error sending OTP", error: error.message });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Debugging: Print OTPs in DB before verification
    console.log("Stored OTPs:", await Otp.find());

    // Find OTP in database
    const existingOtp = await Otp.findOne({ email, otp });

    if (!existingOtp) {
      return res.status(400).json({ message: "Invalid OTP. Try again." });
    }

    // 🔹 OTP is valid, delete it after successful verification
    await Otp.deleteOne({ _id: existingOtp._id });

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};
