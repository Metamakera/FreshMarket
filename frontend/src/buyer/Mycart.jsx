import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const buyerId = localStorage.getItem("buyerId");

  useEffect(() => {
    if (!buyerId) {
      alert("Please log in to view your cart.");
      navigate("/buyer/BuyerAuth");
      return;
    }
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${buyerId}`);
      if (response.status === 200) {
        setCartItems(response.data);
      } else {
        console.error("❌ Failed to fetch cart items:", response.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/cart/add", { buyerId, productId });

      if (response.status === 200) {
        fetchCartItems(); // Refresh cart items
      } else {
        console.error("❌ Failed to add product:", response.data);
      }
    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete("http://localhost:5000/api/cart/remove", {
        data: { buyerId, productId },
      });

      if (response.status === 200) {
        fetchCartItems(); // Refresh cart items
      } else {
        console.error("❌ Failed to remove product:", response.data);
      }
    } catch (error) {
      console.error("Error removing from cart:", error.response?.data || error.message);
    }
  };

  return (
    <div className="product-details-container">
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item.productId} className="product-layout">
            {/* Image Section */}
            <div className="image-section">
              <div className="small-preview">
                <img src={item.imageUrl} alt="Small Preview" />
              </div>
              <div className="image-container">
                <img src={item.imageUrl} alt={item.name} className="main-product-image" />
              </div>
            </div>

            {/* Product Info */}
            <div className="info-section">
              <h1>{item.name}</h1>
              <p className="product-price">₹{item.price.toFixed(2)}</p>
              <p className="product-stock">Quantity: {item.quantity}</p>

              {/* Order & Cart Section */}
              <div className="order-box">
                <button className="buy-now-btn" onClick={() => navigate("/checkout", { state: { product: item } })}>
                  ⚡ Buy Now
                </button>
                <button className="add-to-cart-btn" onClick={() => handleAddToCart(item.productId)}>
                  ➕ Add More
                </button>
                <button className="remove-from-cart-btn" onClick={() => handleRemoveFromCart(item.productId)}>
                  ❌ Remove
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="error-message">🛍️ Your cart is empty.</p>
      )}
    </div>
  );
};

export default MyCart;
