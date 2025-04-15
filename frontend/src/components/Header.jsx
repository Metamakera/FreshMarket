import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import { FiShoppingBag, FiSearch } from "react-icons/fi";
import { FaChevronDown, FaChevronUp, FaUser, FaFish, FaUtensils, FaDollarSign, FaInfoCircle, FaQuestionCircle, FaPhone, FaUtensilSpoon, FaLeaf } from "react-icons/fa";
import Logo from "../assets/Bluewaves.png";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const FishHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [priceError, setPriceError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("buyerEmail");
    if (storedUser) {
      setIsLoggedIn(true);
      setUserName(storedUser.charAt(0).toUpperCase());
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [location]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      localStorage.setItem("searchQuery", searchQuery);
      navigate(`/searchedproduct?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    setShowConfirmLogout(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem("buyerEmail");
    setIsLoggedIn(false);
    setShowConfirmLogout(false);
    navigate("/");
  };

  const cancelLogout = () => {
    setShowConfirmLogout(false);
  };

  const handleCategoryChange = (e, item) => {
    setSelectedCategory(item);
    navigate(`/searchedproduct?category=${encodeURIComponent(item)}`);
  };

  // Debounced function to update price range
  const debouncedSetPriceRange = useCallback(
    debounce((newRange) => {
      setPriceRange(newRange);
    }, 300),
    []
  );

  const handlePriceChange = (type, value) => {
    const numValue = Number(value);
    if (type === "min") {
      if (numValue >= 0 && numValue <= priceRange.max) {
        debouncedSetPriceRange((prev) => ({ ...prev, min: numValue }));
        setPriceError("");
      } else if (numValue > priceRange.max) {
        setPriceError("Minimum price cannot exceed maximum price.");
      }
    } else {
      if (numValue >= priceRange.min && numValue <= 10000) {
        debouncedSetPriceRange((prev) => ({ ...prev, max: numValue }));
        setPriceError("");
      } else if (numValue < priceRange.min) {
        setPriceError("Maximum price cannot be less than minimum price.");
      }
    }
  };

  const handleApplyPrice = () => {
    if (priceRange.min <= priceRange.max) {
      navigate(`/searchedproduct?min=${priceRange.min}&max=${priceRange.max}`);
      setPriceOpen(false);
      setPriceError("");
    } else {
      setPriceError("Please ensure minimum price is less than or equal to maximum price.");
    }
  };

  const handleResetPrice = () => {
    setPriceRange({ min: 0, max: 10000 });
    setPriceError("");
  };

  const handleRecipeNavigation = (recipeType) => {
    navigate(`/recipes?type=${encodeURIComponent(recipeType)}`);
  };

  return (
    <header className="fish-header">
      {/* Top Header */}
      <div className="top-header sticky-top">
        <Link to="/" className="logo-area">
          <img src={Logo} alt="Logo" className="logo" />
        </Link>

        <div className="search-bar">
          <div className="search-input-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Seafood, Recipes and More"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate("/searchedproduct")}
              onKeyDown={handleKeyDown}
              aria-label="Search for seafood, recipes, and more"
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        <div className="right-icons">
          {isLoggedIn ? (
            <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
              <div
                className="user-icon"
                style={{
                  backgroundColor: "#4cd7d0",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  color: "#fff",
                  fontWeight: "bold",
                }}
                aria-label={`User profile for ${userName}`}
              >
                {userName}
              </div>
              {dropdownOpen && (
                <div className={`dropdown-menu user-dropdown ${dropdownOpen ? "show" : ""}`}>
                  <Link to="/MyOrders" state={{ email: localStorage.getItem("buyerEmail") }}>
                    <FaUtensils /> My Orders
                  </Link>
                  <button onClick={handleLogout}>
                    <FaUser /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="icon-button improved-signin"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: isHovered ? "white" : "#4cd7d0",
                color: isHovered ? "#4cd7d0" : "white",
                padding: "10px 20px",
                borderRadius: "5px",
                textDecoration: "none",
                fontWeight: "600",
                transition: "background-color 0.3s, transform 0.2s",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaUser className="signin-icon" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <ul className="nav-links">
          {/* SHOP ALL SEAFOOD with hoverable dropdown */}
          <li className="cat-dropdown">
            <span className="cat-toggle">
              <FaFish /> SHOP ALL SEAFOOD <FaChevronDown />
            </span>
            <ul className="cat-menu">
              {/* Category Submenu */}
              <li className="cat-submenu-container">
                <span className="cat-toggle" onClick={() => setCategoryOpen(!categoryOpen)}>
                  <FaFish /> CATEGORY {categoryOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
                <ul className={`cat-submenu ${categoryOpen ? "show" : ""}`}>
                  {["FISH", "SHRIMP", "CRAB", "LOBSTER"].map((item) => (
                    <li key={item} className="cat-item">
                      <label>
                        <input
                          type="radio"
                          name="category"
                          value={item}
                          onChange={(e) => handleCategoryChange(e, item)}
                          checked={selectedCategory === item}
                        />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </li>

              {/* Price Filter Submenu */}
              <li className="cat-submenu-container">
                <span className="cat-toggle" onClick={() => setPriceOpen(!priceOpen)}>
                  <FaDollarSign /> PRICE {priceOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
                <ul className={`cat-submenu ${priceOpen ? "show" : ""}`}>
                  <li
                    className="cat-item"
                    style={{
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "20px",
                      background: "inherit",
                      borderRadius: "12px",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
                      width: "280px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      transform: priceOpen ? "scale(1.02)" : "scale(1)",
                    }}
                  >
                    {/* Error Message */}
                    {priceError && (
                      <div
                        style={{
                          color: "#dc2626",
                          fontSize: "12px",
                          marginBottom: "10px",
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        {priceError}
                      </div>
                    )}

                    {/* Price Range Inputs */}
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "20px",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          border: "1px solid #d1d5db",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                          transition: "box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)")}
                      >
                        <span style={{ color: "#4b5563", fontWeight: "600" }}>₹</span>
                        <input
                          type="number"
                          value={priceRange.min}
                          onChange={(e) => handlePriceChange("min", e.target.value)}
                          style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "#1f2937",
                            background: "transparent",
                          }}
                          placeholder="Min"
                          min="0"
                          max={priceRange.max}
                          aria-label="Minimum price"
                        />
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          border: "1px solid #d1d5db",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          background: "#ffffff",
                          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                          transition: "box-shadow 0.2s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.05)")}
                      >
                        <span style={{ color: "#4b5563", fontWeight: "600" }}>₹</span>
                        <input
                          type="number"
                          value={priceRange.max}
                          onChange={(e) => handlePriceChange("max", e.target.value)}
                          style={{
                            border: "none",
                            outline: "none",
                            width: "100%",
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "#1f2937",
                            background: "transparent",
                          }}
                          placeholder="Max"
                          min={priceRange.min}
                          max="10000"
                          aria-label="Maximum price"
                        />
                      </div>
                    </div>

                    {/* Range Slider */}
                    <div
                      style={{
                        width: "100%",
                        position: "relative",
                        padding: "25px 0",
                      }}
                    >
                      <div
                        style={{
                          position: "relative",
                          height: "8px",
                          background: "#e5e7eb",
                          borderRadius: "4px",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            height: "100%",
                            background: "linear-gradient(90deg, #4cd7d0, #00a3a3)",
                            borderRadius: "4px",
                            left: `${(priceRange.min / 10000) * 100}%`,
                            width: `${((priceRange.max - priceRange.min) / 10000) * 100}%`,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange("min", e.target.value)}
                        style={{
                          width: "100%",
                          height: "8px",
                          position: "absolute",
                          top: "21px",
                          appearance: "none",
                          background: "transparent",
                          outline: "none",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        aria-label="Minimum price slider"
                        aria-valuenow={priceRange.min}
                        aria-valuemin="0"
                        aria-valuemax="10000"
                      />
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange("max", e.target.value)}
                        style={{
                          width: "100%",
                          height: "8px",
                          position: "absolute",
                          top: "21px",
                          appearance: "none",
                          background: "transparent",
                          outline: "none",
                          cursor: "pointer",
                          zIndex: 2,
                        }}
                        aria-label="Maximum price slider"
                        aria-valuenow={priceRange.max}
                        aria-valuemin="0"
                        aria-valuemax="10000"
                      />
                      {/* Custom Thumb Styling for Range Inputs */}
                      <style>
                        {`
                          input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 18px;
                            height: 18px;
                            background: #ffffff;
                            border: 2px solid #4cd7d0;
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                          }
                          input[type="range"]::-webkit-slider-thumb:hover {
                            transform: scale(1.2);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                          }
                          input[type="range"]::-moz-range-thumb {
                            width: 18px;
                            height: 18px;
                            background: #ffffff;
                            border: 2px solid #4cd7d0;
                            border-radius: 50%;
                            cursor: pointer;
                            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                            transition: transform 0.2s ease, box-shadow 0.2s ease;
                          }
                          input[type="range"]::-moz-range-thumb:hover {
                            transform: scale(1.2);
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                          }
                        `}
                      </style>
                      <div
                        style={{
                          position: "absolute",
                          top: "40px",
                          left: "0",
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                          color: "#4b5563",
                          fontWeight: "500",
                          letterSpacing: "0.02em",
                        }}
                      >
                        <span>₹{priceRange.min}</span>
                        <span>₹{Math.floor((priceRange.min + priceRange.max) / 2)}</span>
                        <span>₹{priceRange.max}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        width: "100%",
                        marginTop: "20px",
                      }}
                    >
                      <button
                        onClick={handleApplyPrice}
                        style={{
                          flex: 1,
                          padding: "12px 24px",
                          background: "linear-gradient(135deg, #4cd7d0, #00a3a3)",
                          border: "none",
                          color: "#ffffff",
                          fontSize: "15px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          boxShadow: "0 6px 16px rgba(76, 215, 208, 0.4)",
                          position: "relative",
                          overflow: "hidden",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 8px 20px rgba(76, 215, 208, 0.6)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 6px 16px rgba(76, 215, 208, 0.4)";
                        }}
                      >
                        <span style={{ position: "relative", zIndex: 1 }}>Apply</span>
                      </button>
                      <button
                        onClick={handleResetPrice}
                        style={{
                          flex: 1,
                          padding: "12px 24px",
                          background: "#ffffff",
                          border: "1px solid #d1d5db",
                          color: "#374151",
                          fontSize: "15px",
                          fontWeight: "600",
                          borderRadius: "8px",
                          cursor: "pointer",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "scale(1.05)";
                          e.target.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "scale(1)";
                          e.target.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="#">
                  <FaLeaf /> STOCK STATUS
                </Link>
              </li>
            </ul>
          </li>

          {/* ABOUT US with nested dropdowns */}
          <li className="about-dropdown">
            <span className="cat-toggle">
              <FaInfoCircle /> ABOUT US <FaChevronDown />
            </span>
            <ul className="about-menu">
              <li>
                <button
                  onClick={() => document.getElementById("faq").scrollIntoView({ behavior: "smooth" })}
                  className="faq"
                  style={{ padding: "8px 16px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", background: "transparent", border: "none", width: "100%", textAlign: "left", transition: "background 0.3s ease" }}
                >
                  <FaQuestionCircle /> FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}
                  className="faq"
                  style={{ padding: "8px 16px", color: "white", cursor: "pointer", display: "flex", alignItems: "center", background: "transparent", border: "none", width: "100%", textAlign: "left", transition: "background 0.3s ease" }}
                >
                  <FaPhone /> CONTACT
                </button>
              </li>
            </ul>
          </li>
          <li className="recipes-dropdown">
            <span className="recipes-toggle">
              <FaUtensilSpoon /> RECIPES & COOKING TIPS <FaChevronDown />
            </span>
            <ul className="recipes-menu">
              <li>
                <Link to={`/recipes?type=${encodeURIComponent("Chef's Recipes")}`}>
                  <FaUtensilSpoon /> Chef's Recipes
                </Link>
              </li>
              <li>
                <Link to={`/recipes?type=${encodeURIComponent("How to Clean & Prep Seafood")}`}>
                  <FaUtensilSpoon /> How to Clean & Prep Seafood
                </Link>
              </li>
              <li>
                <Link to={`/recipes?type=${encodeURIComponent("Cooking Times by Species")}`}>
                  <FaUtensilSpoon /> Cooking Times by Species
                </Link>
              </li>
              <li>
                <Link to={`/recipes?type=${encodeURIComponent("Seasonal Specials")}`}>
                  <FaLeaf /> Seasonal Specials
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      {/* Logout Confirmation Dialog */}
      {showConfirmLogout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              overflow: "hidden",
              position: "relative",
              backgroundColor: "#ffffff",
              textAlign: "left",
              borderRadius: "0.5rem",
              maxWidth: "290px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div
              style={{
                padding: "1.25rem 1rem 1rem 1rem",
                backgroundColor: "#ffffff",
              }}
            >
              <div
                style={{
                  display: "flex",
                  marginLeft: "auto",
                  marginRight: "auto",
                  backgroundColor: "#fee2e2",
                  flexShrink: 0,
                  justifyContent: "center",
                  alignItems: "center",
                  width: "3rem",
                  height: "3rem",
                  borderRadius: "9999px",
                }}
              >
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ color: "#dc2626", width: "1.5rem", height: "1.5rem" }}
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  marginTop: "0.75rem",
                  textAlign: "center",
                }}
              >
                <span
                  style={{
                    color: "#111827",
                    fontSize: "1rem",
                    fontWeight: 600,
                    lineHeight: "1.5rem",
                  }}
                >
                  Logout
                </span>
                <p
                  style={{
                    marginTop: "0.5rem",
                    color: "#6b7280",
                    fontSize: "0.875rem",
                    lineHeight: "1.25rem",
                  }}
                >
                  Are you sure you want to logout? You will need to sign in again to access your account.
                </p>
              </div>
              <div
                style={{
                  margin: "0.75rem 1rem",
                  backgroundColor: "#f9fafb",
                }}
              >
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    fontWeight: 500,
                    justifyContent: "center",
                    width: "100%",
                    borderRadius: "0.375rem",
                    borderWidth: "1px",
                    borderColor: "transparent",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                  }}
                  onClick={confirmLogout}
                >
                  Logout
                </button>
                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    marginTop: "0.75rem",
                    padding: "0.5rem 1rem",
                    backgroundColor: "#ffffff",
                    color: "#374151",
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                    fontWeight: 500,
                    justifyContent: "center",
                    width: "100%",
                    borderRadius: "0.375rem",
                    border: "1px solid #d1d5db",
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                    cursor: "pointer",
                  }}
                  onClick={cancelLogout}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default FishHeader;