import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "/src/pages/styles/ProductListing.css";

const categoryData = {
  Fish: {
    about: "Fish are a great source of omega-3 fatty acids and high-quality protein.",
    benefits: "Improves heart health, brain function, and reduces inflammation.",
  },
  Lobster: {
    about: "Lobsters provide essential vitamins and minerals like B12 and zinc.",
    benefits: "Supports immune function, boosts metabolism, and is low in fat.",
  },
  Crab: {
    about: "Crabs are packed with protein and essential nutrients.",
    benefits: "Promotes muscle growth, supports immunity, and contains omega-3.",
  },
};

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

const ProductListing = () => {
  const [products, setProducts] = useState({});
  const scrollRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductsByCategory();
  }, []);

  const fetchProductsByCategory = async () => {
    const fetchedData = {};
    for (const category in categoryData) {
      try {
        const response = await fetch(`http://localhost:5000/api/render-products/name/${category}`);
        const data = await response.json();
        if (response.ok) {
          const productsWithStock = await Promise.all(
            data.map(async (product) => {
              try {
                const stockResponse = await fetch(`http://localhost:5000/api/stock/${product.productId}`);
                const stockData = await stockResponse.json();
                
                return { 
                  ...product, 
                  stockQuantity: stockData.stock?.stockQuantity || 0,
                  imageUrl: product.imageId 
                    ? `http://localhost:5000/api/image/${product.imageId}` 
                    : "/placeholder.jpg"
                };
              } catch {
                return { 
                  ...product, 
                  stockQuantity: 0,
                  imageUrl: product.imageId 
                    ? `http://localhost:5000/api/image/${product.imageId}` 
                    : "/placeholder.jpg"
                };
              }
            })
          );
          fetchedData[category] = shuffleArray(productsWithStock);
        } else {
          fetchedData[category] = [];
        }
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
        fetchedData[category] = [];
      }
    }
    setProducts(fetchedData);
  };

  // ✅ Handle Add to Cart Click (Commented out as per request)
  const handleAddToCart = (productId) => {
    localStorage.setItem("cartProductId", productId); // Store productId in localStorage
    navigate("/mycart"); // Navigate to MyCart without passing productId in URL
  };

  return (
    <div className="product-listing">
      <div className="rack">
        {Object.keys(categoryData).map((category, index) => (
          <div key={index} className="shelf">
            {/* About & Benefits Section */}
            <div className="info-section">
              <h3>About {category}</h3>
              <p>{categoryData[category].about}</p>
              <h4>Benefits</h4>
              <p>{categoryData[category].benefits}</p>
            </div>

            {/* Product Section */}
            <div className="product-container" ref={(el) => (scrollRefs.current[category] = el)}>
              {products[category]?.length > 0 ? (
                products[category].map((product, index) => (
                  <div 
                    key={product.productId || index} 
                    className="product-card" 
                    onClick={() => navigate(`/product/${product.productId}`)}
                    style={{
                      border: "1px solid #e0e0e0",
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      overflow: "hidden",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      backgroundColor: "#ffffff",
                      margin: "10px",
                      maxWidth: "300px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 6px 16px rgba(0, 0, 0, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                    }}
                  >
                    <div className="product-image" style={{
                      height: "200px",
                      overflow: "hidden",
                      position: "relative",
                    }}>
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        loading="lazy" 
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "opacity 0.3s",
                        }}
                        onError={(e) => { e.target.style.opacity = "0.5"; }}
                      />
                    </div>
                    <div className="product-details" style={{
                      padding: "15px",
                      backgroundColor: "#f9f9f9",
                    }}>
                      <div className="product-header" style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        marginBottom: "10px",
                      }}>
                        <h3 className="product-name" style={{
                          fontSize: "18px",
                          fontWeight: "600",
                          color: "#333",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "70%",
                        }}>{product.name}</h3>
                        <span className="product-price" style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          color: "#2e7d32",
                          margin: 0,
                        }}>₹{product.price ? product.price.toFixed(2) : "N/A"}</span>
                      </div>
                      <p className="product-stock" style={{
                        fontSize: "14px",
                        color: "#666",
                        margin: "5px 0",
                        fontWeight: "500",
                      }}>Stock: {product.stockQuantity} kg</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-products">No {category} products available.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;