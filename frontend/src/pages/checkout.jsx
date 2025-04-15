import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaMapMarkerAlt,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaMoneyBillWave,
  FaCheck,
  FaTruck,
  FaLock,
  FaHome,
  FaBoxOpen,
  FaMapPin,
  FaWallet,
} from "react-icons/fa";
import loginImage from "../assets/Login.jpg";
import loggedInImage from "../assets/success.jpg";

// Keyframes for animations
const packBox = keyframes`
  0% { transform: scale(1); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
  25% { transform: scale(1.05); clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%); }
  50% { transform: scale(1); clip-path: polygon(20% 0, 80% 0, 80% 100%, 20% 100%); }
  75% { transform: scale(1.05); clip-path: polygon(20% 0, 80% 0, 100% 100%, 0 100%); }
  100% { transform: scale(1); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
`;

const bubbleFloat = keyframes`
  0% { transform: translateY(0) scale(0.9); opacity: 0.9; }
  50% { transform: translateY(-120px) scale(1.4); opacity: 0.7; }
  100% { transform: translateY(-240px) scale(0.8); opacity: 0; }
`;

const wave = keyframes`
  0% { background-position-x: 0; }
  100% { background-position-x: 160px; }
`;

const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Styled Components
const Container = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding: 30px 15px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
`;

const CheckoutWrapper = styled.div`
  width: 100%;
  max-width: 900px;
  background: #ffffff;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1f5fe;
`;

const TopSection = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const LoginSection = styled.div`
  flex: 1;
  background: #f5faff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #b3e5fc;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e3f2fd;
  }
`;

const AddressSection = styled.div`
  flex: 2;
  background: #f5faff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #b3e5fc;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e3f2fd;
  }
`;

const OrderSummarySection = styled.div`
  background: #f5faff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #b3e5fc;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e3f2fd;
  }
`;

const PaymentSection = styled.div`
  background: #f5faff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #b3e5fc;
  transition: background-color 0.3s ease;

  &:hover {
    background: #e3f2fd;
  }
`;

const Title = styled.h3`
  font-size: 22px;
  color: #01579b;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
`;

const LoginImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #b3e5fc;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const LoginText = styled.p`
  font-size: 16px;
  color: #1b5e20;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #81d4fa;
  border-radius: 6px;
  font-size: 15px;
  margin-bottom: 12px;
  background: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #0288d1;
    box-shadow: 0 0 6px rgba(2, 136, 209, 0.2);
    outline: none;
  }

  &:disabled {
    background: #eceff1;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #81d4fa;
  border-radius: 6px;
  font-size: 15px;
  min-height: 80px;
  margin-bottom: 12px;
  resize: vertical;
  background: #ffffff;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #0288d1;
    box-shadow: 0 0 6px rgba(2, 136, 209, 0.2);
    outline: none;
  }

  &:disabled {
    background: #eceff1;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background: linear-gradient(90deg, #0288d1 0%, #0277bd 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  transition: background 0.3s ease, opacity 0.3s ease;

  &:hover {
    background: linear-gradient(90deg, #0277bd 0%, #01579b 100%);
    opacity: 0.95;
  }

  &:disabled {
    background: #b0bec5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const QuantityButton = styled.button`
  padding: 8px;
  background: #0288d1;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, opacity 0.3s ease;

  &:hover {
    background: #0277bd;
    opacity: 0.95;
  }

  &:disabled {
    background: #b0bec5;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const ProductImage = styled.img`
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #b3e5fc;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

const PaymentOption = styled.div`
  padding: 12px;
  background: ${(props) => (props.selected ? "#e0f7fa" : "#f5faff")};
  border: 1px solid #81d4fa;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  transition: background-color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background: #e0f7fa;
    border-color: #0288d1;
  }
`;

const SuccessModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuccessContent = styled.div`
  background: linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%);
  max-width: 450px;
  width: 90%;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  border: 1px solid #0288d1;
`;

const PackingBox = styled(FaBoxOpen)`
  font-size: 60px;
  color: #0288d1;
  animation: ${packBox} 2.5s infinite ease-in-out;
  margin-bottom: 20px;
`;

const Bubble = styled.div`
  position: absolute;
  width: ${(props) => props.size || "10px"};
  height: ${(props) => props.size || "10px"};
  background: #81d4fa;
  border-radius: 50%;
  animation: ${bubbleFloat} 3.5s infinite ease-out;
  bottom: 0;
  left: ${(props) => props.left || "50%"};
  animation-delay: ${(props) => props.delay || "0s"};
  box-shadow: 0 0 4px rgba(2, 136, 209, 0.4);
`;

const WaveBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(129, 212, 250, 0.2) 50%,
    rgba(2, 136, 209, 0.2) 100%
  );
  background-size: 160px 100%;
  animation: ${wave} 9s infinite linear;
  z-index: -1;
`;

const SuccessText = styled.h2`
  font-size: 26px;
  color: #1b5e20;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 700;
  animation: ${fadeIn} 1s ease-out;
`;

const SuccessMessage = styled.p`
  font-size: 15px;
  color: #01579b;
  margin-bottom: 20px;
  animation: ${fadeIn} 1.5s ease-out;
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 20px;
  color: #d32f2f;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [stockAvailable, setStockAvailable] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [district, setDistrict] = useState("");
  const [place, setPlace] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("buyerEmail");
    if (email) {
      setIsLoggedIn(true);
      setLoggedInEmail(email);
    }
  }, []);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchStock();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/render-products/product/${productId}`);
      if (response.status === 200 && response.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      setProduct(null); // Ensure product is null on error
    }
  };

  const fetchStock = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${productId}`);
      if (response.status === 200 && response.data) {
        setStockAvailable(response.data.stock?.stockQuantity || 0);
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
      setStockAvailable(0); // Ensure stock is 0 on error
    }
  };

  const handleLogin = () => {
    navigate("/auth", { state: { from: location.pathname } });
  };

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity > 0 && newQuantity <= stockAvailable) {
      setQuantity(newQuantity);
    }
  };

  const handlePaymentSelection = (method) => {
    if (stockAvailable > 0) {
      setPaymentMethod(method);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      alert("Please log in to place an order.");
      return;
    }
    if (!district || !place || !address || !pincode) {
      alert("Please fill all address fields.");
      return;
    }
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    if (stockAvailable === 0) {
      alert("Sorry, the product is out of stock.");
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    const productIdToSend = productId || null;

    if (!productIdToSend || !product) {
      alert("Invalid product information.");
      return;
    }

    const orderData = {
      email: loggedInEmail,
      order_id: orderId,
      product_name: product.name,
      product_quantity: quantity,
      productId: productIdToSend,
      payment_method: paymentMethod,
      district,
      place,
      address,
      pincode,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/buyer/addOrder", orderData);
      if (response.status === 201) {
        setIsOrderPlaced(true);
      }
    } catch (error) {
      console.error("Order Placement Error:", error.response?.data || error.message);
      alert("Failed to place order. Please try again.");
    }
  };

  if (!product) {
    return (
      <Container>
        <ErrorText>
          <FaTimesCircle /> Unable to load product details...
        </ErrorText>
      </Container>
    );
  }

  return (
    <Container>
      <CheckoutWrapper>
        {/* Top Section: Login and Address */}
        <TopSection>
          <LoginSection>
            <Title>
              <FaUser /> 1. Login
            </Title>
            <LoginImage src={isLoggedIn ? loggedInImage : loginImage} alt="Login Status" />
            {isLoggedIn ? (
              <LoginText>
                <FaCheckCircle /> Logged in as <strong>{loggedInEmail}</strong>
              </LoginText>
            ) : (
              <Button onClick={handleLogin}>
                <FaLock /> Login to Continue
              </Button>
            )}
          </LoginSection>

          <AddressSection>
            <Title>
              <FaMapPin /> 2. Delivery Address
            </Title>
            <Input
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!isLoggedIn}
            />
            <Input
              type="text"
              placeholder="Place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={!isLoggedIn}
            />
            <Textarea
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isLoggedIn}
            />
            <Input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              disabled={!isLoggedIn}
            />
          </AddressSection>
        </TopSection>

        {/* Middle Section: Order Summary */}
        <OrderSummarySection>
          <Title>
            <FaBoxOpen /> 3. Order Summary
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <ProductImage src={product.imageUrl} alt={product.name} />
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: "20px", fontWeight: "600", color: "#01579b", marginBottom: "10px" }}>
                {product.name}
              </h4>
              <p style={{ fontSize: "16px", color: "#2e7d32", marginBottom: "8px" }}>
                Price: <strong>₹{product.price.toFixed(2)}</strong>
              </p>
              {stockAvailable > 0 ? (
                <p style={{ fontSize: "14px", color: "#1b5e20", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaCheckCircle /> Stock Available: {stockAvailable} kg
                </p>
              ) : (
                <p style={{ fontSize: "14px", color: "#d32f2f", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FaTimesCircle /> Out of Stock
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "15px 0" }}>
                <QuantityButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity === 1 || stockAvailable === 0}
                >
                  <FaMinus />
                </QuantityButton>
                <span style={{ fontSize: "18px", fontWeight: "500", color: "#01579b" }}>{quantity}</span>
                <QuantityButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= stockAvailable || stockAvailable === 0}
                >
                  <FaPlus />
                </QuantityButton>
              </div>
              <p style={{ fontSize: "16px", color: "#01579b", fontWeight: "600" }}>
                Total: <strong>₹{(product.price * quantity).toFixed(2)}</strong>
              </p>
            </div>
          </div>
        </OrderSummarySection>

        {/* Bottom Section: Payment Options */}
        <PaymentSection>
          <Title>
            <FaWallet /> 4. Payment Option
          </Title>
          <div style={{ display: "flex", gap: "15px" }}>
            <PaymentOption
              selected={paymentMethod === "COD"}
              onClick={() => handlePaymentSelection("COD")}
            >
              <FaMoneyBillWave /> Cash on Delivery
            </PaymentOption>
          </div>
        </PaymentSection>

        {/* Place Order Button */}
        <Button onClick={handlePlaceOrder}>
          <FaTruck /> Place Order
        </Button>

        {/* Order Success Modal */}
        {isOrderPlaced && (
          <SuccessModal>
            <SuccessContent>
              <WaveBackground />
              <Bubble size="12px" left="25%" delay="0s" />
              <Bubble size="9px" left="45%" delay="0.7s" />
              <Bubble size="14px" left="65%" delay="1.4s" />
              <Bubble size="11px" left="85%" delay="2.1s" />
              <PackingBox />
              <SuccessText>
                <FaCheck /> Order Placed!
              </SuccessText>
              <SuccessMessage>
                Your order has been placed and ready for shipment. You'll receive it soon!
              </SuccessMessage>
              <Button onClick={() => navigate("/")}>
                <FaHome /> Go to Home
              </Button>
            </SuccessContent>
          </SuccessModal>
        )}
      </CheckoutWrapper>
    </Container>
  );
};

export default Checkout;