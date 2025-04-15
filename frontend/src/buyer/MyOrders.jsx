import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle, FaSearch, FaStar, FaFilter, FaTimes, FaFish, FaSadTear } from "react-icons/fa";
import styled from "styled-components";
import "./styles/MyOrders.css"; // Retained for potential custom styling

const AvatarContainer = styled.div`
  width: 140px;
  height: 140px;
  background-color: #e6f3f3;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 25px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const CancelButton = styled.button`
  padding: 8px 15px;
  background-color: #6b7280;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #4b5563;
    transform: scale(1.05);
  }
`;

const CancelDialog = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 128, 128, 0.2);
  text-align: center;
  z-index: 1000;
  animation: bubble-pop 0.3s ease-in-out;

  @keyframes bubble-pop {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
`;

const DialogOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const DialogButton = styled.button`
  padding: 8px 20px;
  margin: 10px 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:first-child {
    background-color: #008080;
    color: #fff;
    &:hover {
      background-color: #006666;
    }
  }

  &:last-child {
    background-color: #e5e7eb;
    color: #374151;
    &:hover {
      background-color: #d1d5db;
    }
  }
`;

const MyOrders = () => {
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("buyerEmail") || "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!email) {
        setError("No email provided.");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/buyer/orders/${encodeURIComponent(email)}`);
        if (res.data && Array.isArray(res.data.myorders)) {
          setOrders(res.data.myorders);
        } else {
          setOrders([]);
          setError("No seafood orders found for this email.");
        }
      } catch (err) {
        console.error("❌ Error fetching orders:", err.message);
        setError("Error fetching seafood orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [email]);

  const updateOrderStatus = async (orderId, status) => {
    if (!orderId || !status) {
      setError("Invalid order ID or status.");
      return;
    }

    try {
      const url = `http://localhost:5000/api/buyer/orders/${encodeURIComponent(email)}/${encodeURIComponent(orderId)}/status`;
      const res = await axios.put(url, { status });
      if (res.status === 200) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.order_id === orderId ? { ...order, status } : order
          )
        );
        setError(null);
      }
    } catch (err) {
      console.error(`❌ Error updating order status for order ${orderId}:`, err.message);
      setError("Failed to update order status. Please try again.");
    }
  };

  const handleCancelOrder = (orderId) => {
    setCancelOrderId(orderId);
  };

  const confirmCancel = async () => {
    if (cancelOrderId) {
      await updateOrderStatus(cancelOrderId, "Cancelled");
      setCancelOrderId(null);
    }
  };

  const closeDialog = () => {
    setCancelOrderId(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredOrders = orders.filter((order) =>
    order.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) || ""
  );

  if (loading) return <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>Loading your seafood orders...</p>;
  if (error) return <p style={{ textAlign: "center", color: "#dc2626", padding: "20px" }}>{error}</p>;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f8f0", padding: "20px 0", position: "relative" }}>
      {cancelOrderId && (
        <>
          <DialogOverlay onClick={closeDialog} />
          <CancelDialog>
            <FaSadTear size={40} color="#008080" style={{ marginBottom: "15px" }} />
            <p style={{ fontSize: "16px", color: "#374151", marginBottom: "20px" }}>
              Are you sure you want to cancel this seafood order?
            </p>
            <DialogButton onClick={confirmCancel}>Yes, Cancel</DialogButton>
            <DialogButton onClick={closeDialog}>No, Keep</DialogButton>
          </CancelDialog>
        </>
      )}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        {/* Header with Search and Filter Toggle */}
        <header
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 10px rgba(0, 128, 128, 0.1)",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #e6f3f3, #d1e8e8)",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#008080", margin: 0 }}>
              My Account My Seafood Orders
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Search your seafood orders..."
                value={searchQuery}
                onChange={handleSearch}
                style={{
                  padding: "10px",
                  width: "250px",
                  border: "1px solid #ccc",
                  borderRadius: "4px 0 0 4px",
                  outline: "none",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  transition: "border-color 0.3s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#008080")}
                onBlur={(e) => (e.target.style.borderColor = "#ccc")}
              />
              <button
                style={{
                  padding: "10px 15px",
                  backgroundColor: "#008080",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background-color 0.3s",
                }}
                onClick={() => {}}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#006666")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#008080")}
              >
                <FaSearch />
              </button>
            </div>
            <button
              style={{
                padding: "10px 15px",
                backgroundColor: "#008080",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                transition: "background-color 0.3s",
              }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#006666")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#008080")}
            >
              {isFilterOpen ? <FaTimes /> : <FaFilter />} {isFilterOpen ? "Hide" : "Show"} Filters
            </button>
          </div>
        </header>

        {/* Filter Section */}
        {isFilterOpen && (
          <div
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 128, 128, 0.1)",
              marginBottom: "20px",
              transition: "max-height 0.3s ease",
              maxHeight: "300px",
              overflowY: "auto",
            }}
          >
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#008080", marginBottom: "15px" }}>Filters</h3>
            <div style={{ marginBottom: "15px" }}>
              <h4 style={{ fontSize: "14px", fontWeight: "500", color: "#666", marginBottom: "10px" }}>ORDER STATUS</h4>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> Delivered
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> Cancelled
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> Returned
              </label>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: "500", color: "#666", marginBottom: "10px" }}>ORDER TIME</h4>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> Last 30 days
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> 2024
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> 2023
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> 2022
              </label>
              <label style={{ display: "block", marginBottom: "8px" }}>
                <input type="checkbox" style={{ marginRight: "8px" }} /> Older
              </label>
            </div>
          </div>
        )}

        {/* Order List */}
        <div>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => {
              const price = order.product_quantity ? order.product_quantity * 50 : 0;
              const statusDetails = {
                "Refund Completed": {
                  color: "#f4a261",
                  message: "You returned this seafood order due to quality concerns.",
                  details: "Refund ID: 1210348665407394520 | Refunded on Jan 30 02:31 PM. Funds sent to your account ending with ****827. Contact your bank with ref #50291432619.",
                },
                "Delivered": {
                  color: "#2ecc71",
                  message: `Your fresh seafood arrived${order.delivery_date ? ` on ${order.delivery_date}` : ""}`,
                  details: "",
                },
                "Cancelled": {
                  color: "#dc2626",
                  message: "This order was cancelled.",
                  details: "",
                },
              };

              const statusData = statusDetails[order.status] || { color: "#666", message: "", details: "" };
              const canCancel = order.status !== "Delivered" && order.status !== "Cancelled" && order.status !== "Refund Completed";

              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#fff",
                    padding: "25px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "10px",
                    marginBottom: "25px",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    boxShadow: "0 6px 18px rgba(0, 128, 128, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    background: "linear-gradient(135deg, #ffffff, #f0f8f0)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 128, 128, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 18px rgba(0, 128, 128, 0.1)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <AvatarContainer>
                      <FaFish size={60} color="#008080" />
                    </AvatarContainer>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#008080", marginBottom: "12px" }}>
                        {order.product_name || "Fresh Atlantic Salmon Fillet"}
                      </h3>
                      <p style={{ fontSize: "15px", color: "#666", marginBottom: "10px" }}>
                        Type: Wild-Caught | Weight: 500g
                      </p>
                      <p style={{ fontSize: "20px", fontWeight: "700", color: "#006666", marginBottom: "15px" }}>
                        ₹{price}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "400px", paddingLeft: "25px" }}>
                    <span style={{ color: statusData.color, fontSize: "16px", fontWeight: "500" }}>
                      <FaCheckCircle style={{ marginRight: "10px", verticalAlign: "middle" }} /> {order.status}
                      {statusData.message && ` - ${statusData.message}`}
                    </span>
                    {statusData.details && (
                      <div style={{ fontSize: "13px", color: "#666", marginTop: "12px", lineHeight: "1.6" }}>
                        {statusData.details.split(". ").map((line, i) => (
                          <p key={i}>{line}.</p>
                        ))}
                      </div>
                    )}
                    <a
                      href="#"
                      style={{
                        fontSize: "15px",
                        color: "#008080",
                        textDecoration: "underline",
                        display: "block",
                        marginTop: "20px",
                        transition: "color 0.3s",
                      }}
                      onClick={(e) => e.preventDefault()}
                      onMouseEnter={(e) => (e.target.style.color = "#006666")}
                      onMouseLeave={(e) => (e.target.style.color = "#008080")}
                    >
                      <FaStar style={{ marginRight: "10px", verticalAlign: "middle" }} /> Rate & Review Seafood
                    </a>
                    {canCancel && (
                      <CancelButton onClick={() => handleCancelOrder(order.order_id)}>
                        <FaTimes /> Cancel Order
                      </CancelButton>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", border: "1px solid #e0e0e0", borderRadius: "10px", boxShadow: "0 6px 18px rgba(0, 128, 128, 0.1)", maxWidth: "900px", margin: "0 auto" }}>
              <p style={{ color: "#666", fontSize: "18px" }}>No seafood orders found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;