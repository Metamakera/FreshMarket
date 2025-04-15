const express = require("express");
const { sendOtp, verifyOtp } = require("../controllers/otpController");
const router = express.Router();

router.post("/send-otp", sendOtp);  // Send OTP to email
router.post("/verify-otp", verifyOtp);  // Verify OTP

module.exports = router;
