// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles/SellerLogin.css"; // Ensure you have CSS for styling

// const SellerLogin = () => {
//   const [sellerId, setSellerId] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP as an array
//   const [email, setEmail] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [message, setMessage] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   // ✅ Send OTP Function
//   const sendOtp = async () => {
//     if (!sellerId.trim()) {
//       setError("Seller ID cannot be empty.");
//       return;
//     }
//     setError(""); // Clear previous errors

//     try {
//       const response = await axios.post("http://localhost:5000/api/otp/send-otp", { sellerId });

//       setEmail(response.data.email);
//       setOtpSent(true);
//       setMessage("✅ OTP sent to your registered email.");
//     } catch (error) {
//       setError("❌ Failed to send OTP. Please try again.");
//     }
//   };

//   // ✅ Handle OTP Input (6-digit)
//   const handleOtpChange = (e, index) => {
//     const value = e.target.value.replace(/\D/g, ""); // Allow only numbers
//     if (!value) return;

//     let newOtp = [...otp];
//     newOtp[index] = value;

//     // Move focus to next input box
//     if (index < 5 && value) {
//       document.getElementById(`otp-input-${index + 1}`).focus();
//     }

//     setOtp(newOtp);

//     // If last digit is entered, auto-submit
//     if (index === 5 && value) {
//       verifyOtp(newOtp.join(""));
//     }
//   };

//   // ✅ Verify OTP Function
//   const verifyOtp = async (enteredOtp) => {
//     try {
//       await axios.post("http://localhost:5000/api/otp/verify-otp", { email, otp: enteredOtp });

//       setMessage("✅ OTP verified successfully!");
//       navigate("/seller/dashboard");
//     } catch (error) {
//       setError("❌ Invalid OTP. Try again.");
//       setOtp(["", "", "", "", "", ""]); // Clear OTP input
//     }
//   };

//   return (
//     <div className="seller-login-container">
//       <h2>Seller Login</h2>
//       <div className="login-form">
//         {/* Seller ID Input */}
//         <input
//           type="text"
//           placeholder="Enter Seller ID"
//           value={sellerId}
//           onChange={(e) => setSellerId(e.target.value)}
//           className={`seller-id-input ${error ? "input-error" : ""}`}
//         />
//         <button onClick={sendOtp} disabled={!sellerId.trim()}>Send OTP</button>

//         {/* Display Messages */}
//         {error && <p className="error-message">{error}</p>}
//         {message && <p className="success-message">{message}</p>}

//         {/* OTP Input (Visible After OTP Sent) */}
//         {otpSent && (
//           <div className="otp-input-wrapper">
//             {otp.map((digit, index) => (
//               <input
//                 key={index}
//                 id={`otp-input-${index}`}
//                 type="text"
//                 maxLength="1"
//                 value={digit}
//                 onChange={(e) => handleOtpChange(e, index)}
//                 className="otp-input-box"
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SellerLogin;
