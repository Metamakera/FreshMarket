import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./styles/BuyerAuth.css";

const BuyerAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/api/buyer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Login successful") {
          localStorage.setItem("buyerEmail", data.buyer.email);
          navigate(location.state?.from || "/checkout"); // Redirect to checkout after login
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Buyer Login" : "Buyer Signup"}</h2>
        <p className="toggle-link" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
        </p>
        <form onSubmit={handleAuth}>
          {!isLogin && <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required />}
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
          {!isLogin && <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  );
};

export default BuyerAuth;
