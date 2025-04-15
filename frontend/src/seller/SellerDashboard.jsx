import { useState, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import "../styles/SellerDashboard.css";
import Logo from "../assets/Bluewaves.png";
import {
  FaBoxOpen,
  FaClipboardList,
  FaChartLine,
  FaUserCircle,
  FaSignOutAlt,
  FaEnvelope,
} from "react-icons/fa";
import styled from "styled-components";

function SellerDashboard() {
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const storedSellerId = localStorage.getItem("sellerId");
    if (!storedSellerId) {
      alert("Unauthorized access. Please log in.");
      navigate("/seller-register");
    } else {
      setSellerId(storedSellerId);
    }
  }, []);

  useEffect(() => {
    if (sellerId) {
      fetchSellerProducts();
      fetchPendingOrders();
    }
  }, [sellerId]);

  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
      if (response.status === 200) {
        setTotalProducts(response.data.length);
      } else {
        console.error("Error fetching products: ", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching seller products:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPendingOrders = async () => {
    try {
      const buyerOrdersResponse = await axios.get(`http://localhost:5000/api/buyer/orders/${sellerId}`);
      const orders = buyerOrdersResponse.data;
      let pendingCount = 0;
      for (const order of orders) {
        try {
          const orderStatusResponse = await axios.get(
            `http://localhost:5000/api/buyer/orders/${order.buyerEmail}/${order.orderId}/status`
          );
          if (orderStatusResponse.data.status === "pending") {
            pendingCount += 1;
          }
        } catch (error) {
          console.error("❌ Error fetching order status for order ID:", order.orderId);
        }
      }
      setPendingOrders(pendingCount);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sellerId");
    navigate("/seller-register");
  };

  return (
    <div className="seller-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={Logo} alt="Logo" className="sidebar-logo" />
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/seller/dashboard/products")}><FaBoxOpen /> Products</li>
          <li onClick={() => navigate("/seller/dashboard/orders")}><FaClipboardList /> Orders</li>
          <li onClick={() => navigate("/seller/dashboard/profile")}><FaUserCircle /> Profile</li>
          <li onClick={() => navigate("/seller/dashboard/addrecipe")}><FaChartLine /> Add Recipe</li>
          <li onClick={() => navigate("/seller/dashboard/messages")}><FaEnvelope /> Messages</li>
          <li onClick={() => setShowLogoutConfirm(true)}><FaSignOutAlt /> Logout</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="main-header">
          <h1>Welcome, Seller</h1>
          <p>Seller ID: {sellerId}</p>
        </header>

        {/* Stats Overview */}
        <section className="dashboard-stats">
          <div className="stat-card"><FaBoxOpen /><h3>{loadingStats ? "Loading..." : totalProducts}</h3><p>Total Products</p></div>
          <div className="stat-card"><FaClipboardList /><h3>{loadingStats ? "Loading..." : pendingOrders}</h3><p>Pending Orders</p></div>
          <div className="stat-card"><FaChartLine /><h3>₹1,24,500</h3><p>Total Sales</p></div>
          <div className="stat-card"><FaEnvelope /><h3>8</h3><p>New Messages</p></div>
        </section>

        {/* Nested Route Content */}
        <section className="dashboard-outlet"><Outlet /></section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ModalOverlay>
          <div className="card">
            <div className="header">
              <div className="image">
                <svg aria-hidden="true" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </div>
              <div className="content">
                <span className="title">Confirm Logout</span>
                <p className="message">Are you sure you want to log out? You will be redirected to the login page.</p>
              </div>
              <div className="actions">
                <button className="desactivate" onClick={handleLogout}>Logout</button>
                <button className="cancel" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
}

export default SellerDashboard;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.4);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;

  .card {
    overflow: hidden;
    background-color: #fff;
    text-align: left;
    border-radius: 0.5rem;
    max-width: 320px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
  }

  .header {
    padding: 1.25rem 1rem 1rem 1rem;
    background-color: #ffffff;
  }

  .image {
    display: flex;
    margin: auto;
    background-color: #fee2e2;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .image svg {
    color: #dc2626;
    width: 1.5rem;
    height: 1.5rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
  }

  .message {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .actions {
    margin: 0.75rem 1rem;
  }

  .desactivate {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: none;
    margin-bottom: 0.5rem;
  }

  .cancel {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #374151;
    font-size: 1rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
  }

  button {
    cursor: pointer;
  }
`;
