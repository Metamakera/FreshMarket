import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MaximizedProductView.css";
import DeleteModal from "./DeleteModal";

function MaximizedProductView({ product, onClose, onDeleteProduct, refreshProducts }) {
  const [editableProduct, setEditableProduct] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
  });

  const [stockQuantity, setStockQuantity] = useState(0);
  const [hoverPosition, setHoverPosition] = useState({ x: "50%", y: "50%" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateMessage, setUpdateMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchStock();
  }, []);

  // ✅ Fetch stock details
  const fetchStock = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${product.productId}`);
      setStockQuantity(response.data.stock.stockQuantity || 0);
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  // ✅ Increase stock by 2
  const handleIncreaseStock = async () => {
    try {
      await axios.post(`http://localhost:5000/api/stock/add/${product.productId}`, { stockQuantity: 2 });
      fetchStock();
      refreshProducts();
    } catch (error) {
      console.error("Error adding stock:", error);
    }
  };

  // ✅ Decrease stock by 2 (minimum stock is 0)
  const handleDecreaseStock = async () => {
    if (stockQuantity > 0) {
      try {
        await axios.post(`http://localhost:5000/api/stock/add/${product.productId}`, { stockQuantity: -2 });
        fetchStock();
        refreshProducts();
      } catch (error) {
        console.error("Error removing stock:", error);
      }
    }
  };

  // ✅ Handle Mouse Hover on Image
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100 + "%";
    const y = ((e.clientY - top) / height) * 100 + "%";
    setHoverPosition({ x, y });
  };

  return (
    <div className="maximized-overlay">
      {!showDeleteModal && (
        <div className="maximized-container">
          <div className="product-details-section">
            <h1>Product Details</h1>

            {showUpdateForm ? (
              <div className="update-form">
                <label><strong>Name:</strong></label>
                <input type="text" name="name" value={editableProduct.name} onChange={(e) => setEditableProduct({ ...editableProduct, name: e.target.value })} />

                <label><strong>Description:</strong></label>
                <textarea name="description" value={editableProduct.description} onChange={(e) => setEditableProduct({ ...editableProduct, description: e.target.value })} />

                <label><strong>Price (₹):</strong></label>
                <input type="number" name="price" value={editableProduct.price} onChange={(e) => setEditableProduct({ ...editableProduct, price: e.target.value })} />

                <button onClick={() => setShowUpdateForm(false)} className="cancel-update-btn">Cancel</button>
              </div>
            ) : (
              <>
                <p><strong>Name:</strong> {product.name}</p>
                <p className="product-description">{product.description}</p>
                <p><strong>Price:</strong> ₹{product.price}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Product ID:</strong> {product.productId}</p>
                <button onClick={() => setShowUpdateForm(true)} className="toggle-update-btn">Update Product</button>
              </>
            )}

            {/* ✅ Stock Management */}
            <div className="stock-update-section">
              <label><strong>Stock (kg):</strong></label>
              <div className="stock-input-container">
                <button className="stock-btn decrease-btn" onClick={handleDecreaseStock} disabled={stockQuantity <= 0}>-</button>
                <input type="text" value={`${stockQuantity} kg`} readOnly className="stock-input" />
                <button className="stock-btn increase-btn" onClick={handleIncreaseStock}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={() => setShowDeleteModal(true)} className="delete-btn">Delete Product</button>
            </div>

            <button className="back-btn" onClick={onClose}>⬅ Back</button>
          </div>

          {/* ✅ Product Image Section */}
          <div className="product-image-section">
            {product.imageId ? (
              <img 
                src={`http://localhost:5000/api/image/${product.imageId}`} 
                alt={product.name} 
                className="product-image-large"
                style={{ transformOrigin: `${hoverPosition.x} ${hoverPosition.y}` }}
                onMouseMove={handleMouseMove}
              />
            ) : (
              <p>No Image Available</p>
            )}
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal 
          productId={product.productId}
          onDeleteConfirm={() => onDeleteProduct(product.productId)}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}

      {/* ✅ Popup Message */}
      {showPopup && (
        <div className="popup-message">
          <p>{updateMessage}</p>
          <button onClick={() => setShowPopup(false)}>OK</button>
        </div>
      )}
    </div>
  );
}

export default MaximizedProductView;
