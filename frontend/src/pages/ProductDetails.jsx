import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFish, FaSnowflake, FaLeaf, FaBoxOpen, FaTruck, FaShoppingBag, FaTimesCircle } from "react-icons/fa";
import "./styles/ProductDetails.css";

const ProductDetails = ({ setCheckoutProduct }) => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(0);
  const [imageGallery, setImageGallery] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: "50%", y: "50%" });
  const [relatedProducts, setRelatedProducts] = useState([]);

  const categoryCode = productId ? productId.split("-").slice(0, 2).join("-") : "";

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchStock();
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/render-products/product/${productId}`);
      if (response.status === 200 && response.data) {
        setProduct(response.data);
        setImageGallery(response.data.imageGallery || []);
        setSelectedImage(response.data.imageUrl || "");
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const fetchStock = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stock/${productId}`);
      if (response.status === 200 && response.data) {
        setStockQuantity(response.data.stock?.stockQuantity || 0);
      }
    } catch (error) {
      console.error("Error fetching stock:", error);
    }
  };

  const fetchRelatedProducts = async () => {
    if (!categoryCode) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/searchproduct/category/${categoryCode}`);
      if (response.status === 200 && response.data) {
        const filteredProducts = response.data.filter((item) => item.productId !== productId);
        setRelatedProducts(filteredProducts);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      const updatedProduct = { ...product, stockQuantity };
      setCheckoutProduct(updatedProduct); // Passes the selected product
      navigate(`/checkout/${product.productId}`); // Pass productId in the URL
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100 + "%";
    const y = ((e.clientY - top) / height) * 100 + "%";
    setHoverPosition({ x, y });
  };

  return (
    <div className="product-details-container" style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "20px", boxSizing: "border-box" }}>
      {product ? (
        <>
          {/* Left Section: Selected Product Details (60%) */}
          <div className="product-layout" style={{ flex: "0 0 60%", marginRight: "20px" }}>
            <div className="image-section">
              <div className="small-preview" style={{ width: "100px", height: "100px", overflow: "hidden", border: "1px solid #ddd", borderRadius: "5px" }}>
                <img src={selectedImage} alt="Small Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="image-container">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="main-product-image"
                  style={{ transformOrigin: `${hoverPosition.x} ${hoverPosition.y}`, width: "100%", height: "auto", maxHeight: "500px", objectFit: "contain" }}
                  onMouseMove={handleMouseMove}
                />
              </div>
              <div className="thumbnail-container" style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                {imageGallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="Thumbnail"
                    className={`thumbnail ${selectedImage === img ? "selected" : ""}`}
                    onClick={() => setSelectedImage(img)}
                    style={{ width: "60px", height: "60px", objectFit: "cover", border: "2px solid #fff", borderRadius: "5px", cursor: "pointer", boxShadow: selectedImage === img ? "0 0 5px #008080" : "none", transition: "box-shadow 0.3s" }}
                  />
                ))}
              </div>
            </div>

            <div className="info-section">
              <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#008080", marginBottom: "10px" }}>{product.name}</h1>
              <p className="product-price" style={{ fontSize: "24px", fontWeight: "600", color: "#2e7d32", marginBottom: "15px" }}>₹{product.price.toFixed(2)}</p>
              <p className={`product-stock ${stockQuantity === 0 ? "out-of-stock" : ""}`} style={{ fontSize: "16px", color: stockQuantity === 0 ? "#dc3545" : "#28a745", marginBottom: "10px", fontWeight: "500" }}>
                {stockQuantity > 0 ? <FaFish style={{ marginRight: "5px", verticalAlign: "middle" }} /> : <FaTimesCircle style={{ marginRight: "5px", verticalAlign: "middle" }} />}
                {stockQuantity > 0 ? `In Stock (${stockQuantity} kg)` : "Out of Stock"}
              </p>
              <p className="seller-info" style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>Selling by: <strong style={{ color: "#008080" }}>Blue Waves Pvt Ltd</strong></p>

              <div className="order-box" style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button className="buy-now-btn" onClick={handleBuyNow} style={{
                  padding: "12px 75px",
                  backgroundColor: "#008080",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background-color 0.3s",
                  boxShadow: "0 2px 4px rgba(0, 128, 128, 0.3)",
                }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#006666";
                    e.target.style.color = "white";
                    e.target.style.border = "1px solid #006666";
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#006666";
                  }}>
                  <FaShoppingBag /> Buy Now
                </button>
              </div>

              <div className="about-section">
                <h3 style={{ fontSize: "20px", fontWeight: "600", color: "#008080", marginBottom: "10px" }}>About this Seafood</h3>
                <ul style={{ listStyle: "none", padding: 0, color: "#333" }}>
                  <li style={{ marginBottom: "8px" }}><FaFish style={{ marginRight: "8px", color: "#008080" }} /> Sourced from the <strong>Atlantic Ocean</strong></li>
                  <li style={{ marginBottom: "8px" }}><FaSnowflake style={{ marginRight: "8px", color: "#008080" }} /> Delivered <strong>frozen</strong> to preserve freshness</li>
                  <li style={{ marginBottom: "8px" }}><FaLeaf style={{ marginRight: "8px", color: "#008080" }} /> Certified <strong>sustainable seafood</strong></li>
                  <li style={{ marginBottom: "8px" }}><FaSnowflake style={{ marginRight: "8px", color: "#008080" }} /> Store at <strong>-18°C</strong></li>
                  <li style={{ marginBottom: "8px" }}><FaBoxOpen style={{ marginRight: "8px", color: "#008080" }} /> Packed in <strong>eco-friendly vacuum-sealed packaging</strong></li>
                  <li style={{ marginBottom: "8px" }}><FaTruck style={{ marginRight: "8px", color: "#008080" }} /> <strong>Same-day shipping</strong> available</li>
                  <li style={{ marginBottom: "8px" }}><FaFish style={{ marginRight: "8px", color: "#008080" }} /> Rich in <strong>Omega-3 fatty acids</strong> and <strong>protein</strong></li>
                  <li style={{ marginBottom: "8px" }}><FaLeaf style={{ marginRight: "8px", color: "#008080" }} /> Best prepared <strong>grilled or steamed</strong> for optimal flavor</li>
                  <li style={{ marginBottom: "8px" }}><FaTruck style={{ marginRight: "8px", color: "#008080" }} /> <strong>Free delivery</strong> on orders above ₹500</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Section: Similar Products (40%) */}
          <section className="related-products" style={{ flex: "0 0 40%", maxWidth: "40%" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#008080", marginBottom: "15px" }}>Similar Seafood</h2>
            <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", flexWrap: "wrap" }}>
              {relatedProducts.length > 0 ? (
                relatedProducts.map((item) => (
                  <div key={item.productId} className="related-product-card" onClick={() => navigate(`/product/${item.productId}`)} style={{
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    overflow: "hidden",
                    width: "100%",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    transition: "transform 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                    <img src={item.imageUrl} alt={item.name} className="related-product-image" style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                    <div className="related-product-info" style={{ padding: "10px", backgroundColor: "#f9f9f9" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#333", margin: "5px 0" }}>{item.name}</h3>
                      <p style={{ fontSize: "16px", fontWeight: "600", color: "#2e7d32", margin: "5px 0" }}>₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#666", fontSize: "16px" }}>No related seafood found.</p>
              )}
            </div>
          </section>
        </>
      ) : (
        <p className="error-message" style={{ fontSize: "18px", color: "#dc3545", textAlign: "center", padding: "20px" }}><FaTimesCircle style={{ marginRight: "8px", verticalAlign: "middle" }} /> Failed to load product details. Please try again.</p>
      )}
    </div>
  );
};

export default ProductDetails;