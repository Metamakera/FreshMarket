import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaEnvelope, FaLock, FaKey, FaArrowLeft, FaArrowRight, FaCheck } from "react-icons/fa";
import styled, { keyframes } from "styled-components";
import "/src/pages/styles/SellerRegister.css";

// Animation keyframes
const tickAnimation = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const circleAnimation = keyframes`
  0% { stroke-dashoffset: 1000; }
  100% { stroke-dashoffset: 0; }
`;

const bubbleAnimation = keyframes`
  0% { transform: translateY(0) scale(0); opacity: 1; }
  100% { transform: translateY(-150px) scale(1.5); opacity: 0; }
`;

const windowAnimation = keyframes`
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// Styled components for animation
const AnimationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuccessWindow = styled.div`
  position: relative;
  width: 400px;
  padding: 20px;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: ${windowAnimation} 0.5s ease-out forwards;
`;

const TickCircle = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
`;

const TickIcon = styled(FaCheck)`
  font-size: 40px;
  color: #28a745;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${tickAnimation} 0.5s ease-out forwards;
`;

const CircleSvg = styled.svg`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);

  circle {
    fill: none;
    stroke: #28a745;
    stroke-width: 8;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: ${circleAnimation} 1.5s ease-out forwards;
  }
`;

const Bubble = styled.div`
  position: absolute;
  width: 15px;
  height: 15px;
  background: radial-gradient(circle, rgba(40, 167, 69, 0.8), rgba(40, 167, 69, 0));
  border-radius: 50%;
  animation: ${bubbleAnimation} 1.5s ease-out forwards;
  pointer-events: none;

  ${({ delay }) => delay && `animation-delay: ${delay}s;`}
  ${({ x, y }) => `left: ${x}%; top: ${y}%;`}
`;

const SuccessMessage = styled.div`
  margin-top: 20px;
`;

const SuccessTitle = styled.h3`
  color: #28a745;
  margin-bottom: 10px;
`;

const SuccessText = styled.p`
  color: #333;
  font-size: 16px;
  margin: 5px 0;
`;

const SellerIdHighlight = styled.span`
  font-weight: bold;
  color: #007bff;
`;

function SellerRegister() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const [generatedSellerId, setGeneratedSellerId] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [showAnimation, setShowAnimation] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    businessName: "",
    location: "",
    gstin: "",
    accDetails: "",
    panCardNumber: "",
  });

  const [loginData, setLoginData] = useState({
    sellerId: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isLogin) {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) document.getElementById(`otp-${index + 1}`).focus();
    if (newOtp.every((num) => num !== "")) verifyOtp(newOtp.join(""));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/seller/signup", formData);
      const sellerId = response.data.seller.sellerId;
      setGeneratedSellerId(sellerId);
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        setIsLogin(true);
      }, 4000); // Extended to 4 seconds for better visibility
    } catch (error) {
      alert("Registration Failed. Try again.");
    }
  };

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/otp/send-otp", { sellerId: loginData.sellerId });
      setLoginData((prev) => ({ ...prev, email: response.data.email }));
      setOtpSent(true);
      setMessage("OTP sent to your registered email.");
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
    }
  };

  const verifyOtp = async (otpValue) => {
    try {
      await axios.post("http://localhost:5000/api/otp/verify-otp", {
        email: loginData.email,
        otp: otpValue,
      });
      localStorage.setItem("sellerId", loginData.sellerId);
      navigate("/seller/dashboard");
    } catch (error) {
      setMessage("Invalid OTP. Try again.");
      setOtp(["", "", "", ""]);
    }
  };

  return (
    <div className="seller-auth-page">
      <div className={`seller-auth-wrapper ${isLogin ? "seller-login-mode" : "seller-signup-mode"}`}>
        {/* Login Section */}
        <div className="seller-auth-container">
          <div className="seller-auth-box">
            <h2>Seller Login</h2>
            {!otpSent ? (
              <>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="sellerId"
                    placeholder="Enter Seller ID"
                    value={loginData.sellerId}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button onClick={sendOtp}>
                  <FaKey className="button-icon" /> Send OTP
                </button>
              </>
            ) : (
              <div className="otp-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    className="otp-box"
                  />
                ))}
              </div>
            )}
            <p>{message}</p>
            <p>
              Don't have an account?{" "}
              <button onClick={() => setIsLogin(false)}>
                <FaUser className="button-icon" /> Register
              </button>
            </p>
          </div>
        </div>

        {/* Image Overlay */}
        <div className="seller-image-section">
          <div className="seller-overlay">
            <h3>Sell with Confidence</h3>
            <p>Join our marketplace and grow your business</p>
          </div>
        </div>

        {/* Registration Section */}
        <div className="seller-register-box">
          <h2>Seller Registration</h2>
          <form onSubmit={handleRegister}>
            {step === 1 && (
              <>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="button" onClick={nextStep}>
                  <FaArrowRight className="button-icon" /> Next
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business/Office Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="button" onClick={prevStep}>
                  <FaArrowLeft className="button-icon" /> Back
                </button>
                <button type="button" onClick={nextStep}>
                  <FaArrowRight className="button-icon" /> Next
                </button>
              </>
            )}

            {step === 3 && (
              <>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="gstin"
                    placeholder="GSTIN"
                    value={formData.gstin}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="accDetails"
                    placeholder="Bank Account Details"
                    value={formData.accDetails}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="custom-input-group">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    name="panCardNumber"
                    placeholder="PAN Card Number"
                    value={formData.panCardNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="button" onClick={prevStep}>
                  <FaArrowLeft className="button-icon" /> Back
                </button>
                <button type="submit">
                  <FaCheck className="button-icon" /> Register
                </button>
              </>
            )}
          </form>
          <p>
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)}>
              <FaUser className="button-icon" /> Sign In
            </button>
          </p>
        </div>

        {/* Animation on successful registration */}
        {showAnimation && (
          <AnimationContainer>
            <SuccessWindow>
              <TickCircle>
                <CircleSvg>
                  <circle cx="50" cy="50" r="45" />
                </CircleSvg>
                <TickIcon />
                {/* Bubble effects */}
                <Bubble delay={0.1} x={10} y={90} />
                <Bubble delay={0.2} x={20} y={80} />
                <Bubble delay={0.3} x={80} y={80} />
                <Bubble delay={0.4} x={90} y={90} />
                <Bubble delay={0.5} x={50} y={95} />
              </TickCircle>
              <SuccessMessage>
                <SuccessTitle>Registration Successful!</SuccessTitle>
                <SuccessText>
                </SuccessText>
                <SuccessText>Details have been sent to your registered email.</SuccessText>
              </SuccessMessage>
            </SuccessWindow>
          </AnimationContainer>
        )}
      </div>
    </div>
  );
}

export default SellerRegister;