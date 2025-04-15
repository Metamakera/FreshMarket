import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronDown, FaClock, FaCheckCircle, FaTruck, FaPauseCircle } from "react-icons/fa";
import "./styles/ViewOrders.css";

const getStatusIcon = (status) => {
  switch ((status || "Pending").toLowerCase()) {
    case "pending":
      return <FaClock style={{ marginRight: 8, color: "#856404" }} />;
    case "accepted":
      return <FaCheckCircle style={{ marginRight: 8, color: "#0c5460" }} />;
    case "dispatched":
      return <FaTruck style={{ marginRight: 8, color: "#155724" }} />;
    case "hold":
      return <FaPauseCircle style={{ marginRight: 8, color: "#721c24" }} />;
    default:
      return null;
  }
};

const statusOptions = ["Pending", "Accepted", "Dispatched", "Hold"];

const ViewOrders = () => {
  const sellerId = localStorage.getItem("sellerId");
  const [sellerProducts, setSellerProducts] = useState([]);
  const [buyerProductIds, setBuyerProductIds] = useState([]);
  const [matchingOrders, setMatchingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSellerProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
      setSellerProducts(res.data);
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  const fetchBuyerProductIds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/buyer/product-ids");
      setBuyerProductIds(res.data.productIds);
    } catch (error) {
      console.error("Error fetching buyer product IDs:", error);
    }
  };

  const fetchMatchingOrders = async (productId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/buyer/orders/product/${productId}`);
      return res.data.orders || [];
    } catch (error) {
      console.error("Error fetching orders for product:", productId, error);
      return [];
    }
  };

  const compareProductIds = async () => {
    const data = [];
    const seenOrders = new Set();
  
    const uniqueProductIds = Array.from(
      new Set(sellerProducts.map((product) => product.productId))
    );
  
    for (let productId of uniqueProductIds) {
      if (buyerProductIds.includes(productId)) {
        const orders = await fetchMatchingOrders(productId);
  
        orders.forEach(order => {
          const uniqueKey = `${order.order_id}-${order.buyer_email}`;
          if (!seenOrders.has(uniqueKey)) {
            seenOrders.add(uniqueKey);
            data.push(order);
          }
        });
      }
    }
  
    setMatchingOrders(data);
    setLoading(false);
  };
  

  const refetchAll = async () => {
    setLoading(true);
    await fetchSellerProducts();
    await fetchBuyerProductIds();
  };

  const updateStatus = async (buyerEmail, orderId, status) => {
    try {
      setLoading(true); // Start loading animation
  
      const url = `http://localhost:5000/api/buyer/orders/${buyerEmail}/${orderId}/status`;
      await axios.put(url, { status });
  
      // Optional: wait for backend to update
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Re-fetch orders to get updated statuses
      await compareProductIds();
  
      // Force a 3-second loading animation (if needed)
      setTimeout(() => {
        setLoading(false);
      }, 3000);
  
    } catch (err) {
      console.error("Error updating status:", err);
      setLoading(false);
    }
  };
  

  const handleStatusChange = (order, newStatus) => {
    updateStatus(order.buyer_email, order.order_id, newStatus);
  };

  useEffect(() => {
    refetchAll();
  }, [sellerId]);

  useEffect(() => {
    if (sellerProducts.length > 0 && buyerProductIds.length > 0) {
      compareProductIds();
    }
  }, [sellerProducts, buyerProductIds]);

  const groupedOrders = {
    "Accepted & Dispatched": [],
    "Pending": [],
    "Hold": []
  };

  matchingOrders.forEach(order => {
    const status = (order.status || "Pending").toLowerCase();
    if (status === "accepted" || status === "dispatched") {
      groupedOrders["Accepted & Dispatched"].push(order);
    } else if (status === "hold") {
      groupedOrders["Hold"].push(order);
    } else {
      groupedOrders["Pending"].push(order);
    }
  });

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="view-orders">
      <h1>Manage Orders</h1>
      {Object.entries(groupedOrders).map(([group, orders]) => (
        <div key={group} className="order-section">
          <h2>{group}</h2>
          {orders.length ? (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Payment</th>
                  <th>District</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={`${order.order_id}-${order.buyer_email}`}>
                    <td>{order.order_id}</td>
                    <td>{order.product_name}</td>
                    <td>{order.product_quantity}</td>
                    <td>{order.payment_method}</td>
                    <td>{order.district}</td>
                    <td>{order.address}</td>
                    <td>{order.pincode}</td>
                    <td>{order.status}</td>
                    <td>
                      <div className="custom-dropdown">
                        <button className={`dropdown-button status-${order.status?.toLowerCase()}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                          <FaChevronDown className="dropdown-chevron" />
                        </button>
                        <div className="dropdown-options">
                          {statusOptions.map(status => (
                            <div
                              key={status}
                              className="dropdown-option"
                              onClick={() => handleStatusChange(order, status)}
                            >
                              {getStatusIcon(status)}
                              {status}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty-msg">No {group.toLowerCase()} orders found.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ViewOrders;
