import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaFish, FaSpider, FaLeaf } from "react-icons/fa";
import { GiShrimp, GiSquid } from "react-icons/gi";

const categories = [
  { name: "Fish", code: "F-01", icon: <FaFish /> },
  { name: "Shrimp", code: "S-01", icon: <GiShrimp /> },
  { name: "Shellfish", code: "SH-01", icon: <FaSpider /> },
  { name: "Cephalopods", code: "C-01", icon: <GiSquid /> },
  { name: "Vegetation", code: "V-01", icon: <FaLeaf /> },
];

const SearchedProduct = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchQuery = localStorage.getItem("searchQuery");

  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");
  const nameFromURL = queryParams.get("name");
  const minPrice = queryParams.get("min");
  const maxPrice = queryParams.get("max");

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else if (categoryFromURL) {
      setSelectedCategory(categoryFromURL);
      fetchProductsByCategory(categoryFromURL);
    } else if (nameFromURL) {
      searchProductsByNameURL(nameFromURL);
    } else if (searchQuery) {
      fetchProductsByName(searchQuery);
    }
  }, [selectedCategory, categoryFromURL, nameFromURL, searchQuery]);

  const fetchProductsByCategory = async (categoryId) => {
    setLoading(true);
    setProducts([]);
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/searchproduct/category/${categoryId}`);
        const data = await response.json();
        if (response.ok) {
          const productsWithStock = await Promise.all(
            data.map(async (product) => {
              try {
                const stockResponse = await fetch(`http://localhost:5000/api/stock/${product.productId}`);
                const stockData = await stockResponse.json();
                return { ...product, stockQuantity: stockData.stock?.stockQuantity || 0 };
              } catch {
                return { ...product, stockQuantity: 0 };
              }
            })
          );
          setProducts(productsWithStock);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(`Error fetching products for ${categoryId}:`, error);
        setProducts([]);
      }
      setLoading(false);
    }, 4000);
  };

  const fetchProductsByName = async (name) => {
    setLoading(true);
    setProducts([]);
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/render-products/name/${encodeURIComponent(name)}`);
        const data = await response.json();
        if (response.ok) {
          const productsWithStock = await Promise.all(
            data.map(async (product) => {
              try {
                const stockResponse = await fetch(`http://localhost:5000/api/stock/${product.productId}`);
                const stockData = await stockResponse.json();
                return { ...product, stockQuantity: stockData.stock?.stockQuantity || 0 };
              } catch {
                return { ...product, stockQuantity: 0 };
              }
            })
          );
          setProducts(productsWithStock);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(`Error fetching products for ${name}:`, error);
        setProducts([]);
      }
      setLoading(false);
    }, 4000);
  };

  const searchProductsByNameURL = async (name) => {
    setLoading(true);
    setProducts([]);
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/render-products/name/${encodeURIComponent(name)}`);
        const data = await response.json();
        if (response.ok) {
          const productsWithStock = await Promise.all(
            data.map(async (product) => {
              try {
                const stockResponse = await fetch(`http://localhost:5000/api/stock/${product.productId}`);
                const stockData = await stockResponse.json();
                return { ...product, stockQuantity: stockData.stock?.stockQuantity || 0 };
              } catch {
                return { ...product, stockQuantity: 0 };
              }
            })
          );
          setProducts(productsWithStock);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error(`Error fetching products for ${name}:`, error);
        setProducts([]);
      }
      setLoading(false);
    }, 4000);
  };

  const handleProductClick = (productId) => {
    localStorage.setItem("selectedProductId", productId);
    navigate(`/product/${productId}`);
  };

  return (
    <div className="searched-product-container">
      <h2>Search Results</h2>

      <div className="category-list">
        {categories.map((category) => (
          <label key={category.code} className={`category-item ${selectedCategory === category.code ? "active" : ""}`}>
            <input
              type="checkbox"
              checked={selectedCategory === category.code}
              onChange={() => setSelectedCategory(category.code === selectedCategory ? null : category.code)}
            />
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </label>
        ))}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="circle">
            <div className="wave"></div>
          </div>
        </div>
      )}

      {!loading && (
        <div className="product-grid">
          {products.length === 0 ? (
            <p className="no-products">
              No products found for {selectedCategory ? `category "${selectedCategory}"` : nameFromURL ? `search "${nameFromURL}"` : `search "${searchQuery}"`}
            </p>
          ) : (
            products.map((product) => (
              <div key={product.productId} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price" onClick={() => handleProductClick(product.productId)}>
                    ₹{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <style>
        {`
          /* Full Page Styling */
          .searched-product-container {
            width: 100vw;
            min-height: 100vh;
            padding: 40px 5%;
            background-color: transparent;
            text-align: center;
            display: flex;
            flex-direction: column;
          }

          /* Title */
          .searched-product-container h2 {
            font-size: 2.2em;
            color: #333;
            margin-bottom: 20px;
          }

          /* Category List */
          .category-list {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 20px;
          }

          .category-item {
            display: flex;
            align-items: center;
            padding: 5px 10px;
            font-size: 1em;
            color: #333;
            cursor: pointer;
            transition: background 0.3s ease-in-out;
          }

          .category-item:hover {
            background: rgba(0, 123, 255, 0.1);
          }

          .category-item.active {
            color: #0056b3;
            font-weight: bold;
          }

          .category-item input {
            margin-right: 10px;
            cursor: pointer;
          }

          .category-icon {
            margin-right: 5px;
            font-size: 1.1em;
            color: #007bff;
          }

          .category-name {
            margin-right: 5px;
          }

          /* 🛍️ Product Grid */
          .product-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr); /* Fixed 5 products per row */
            gap: 20px;
            justify-content: center;
            padding-top: 20px;
          }

          /* 🏷️ Product Card */
          .product-card {
            background: white;
            border: 1px solid #ccc; /* Light Grey Border */
            border-radius: 10px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
            position: relative;
            overflow: hidden;
          }

          .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
            border-color: #007bff; /* Highlight border on hover */
          }

          /* 🖼️ Product Image */
          .product-image {
            width: 100%;
            height: 180px;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            border-radius: 8px;
            background: #f0f0f0;
          }

          .product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
          }

          /* 🔍 Hover Effect */
          .product-card:hover .product-image img {
            transform: scale(1.1);
            filter: grayscale(0);
          }

          /* 🏷️ Product Details */
          .product-name {
            font-size: 1.1em;
            font-weight: bold;
            color: #222;
            margin-top: 10px;
          }

          .product-price {
            font-size: 1em;
            color: rgb(0, 42, 157);
            border-radius: 6px;
            padding: 6px 12px;
            display: inline-block;
            font-weight: bold;
            margin-top: 10px;
            cursor: pointer;
            transition: background 0.3s ease-in-out;
          }

          .product-description {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
            line-height: 1.4;
            text-align: center;
          }

          /* No Products Message */
          .no-products {
            font-size: 1em;
            color: #888;
            text-align: center;
            width: 100%;
          }

          /* 🔄 Loading Animation */
          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
          }

          .circle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150px;
            height: 150px;
            background: #ccc;
            border: 5px solid #fff;
            box-shadow: 0 0 0 5px #4973ff;
            border-radius: 50%;
            overflow: hidden;
          }

          .wave {
            position: relative;
            width: 100%;
            height: 100%;
            background: #4973ff;
            border-radius: 50%;
            box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
          }

          .wave:before,
          .wave:after {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            top: 0;
            left: 50%;
            transform: translate(-50%, -75%);
            background: #000;
          }

          .wave:before {
            border-radius: 45%;
            background: rgba(255, 255, 255, 1);
            animation: animate 5s linear infinite;
          }

          .wave:after {
            border-radius: 40%;
            background: rgba(255, 255, 255, 0.5);
            animation: animate 10s linear infinite;
          }

          @keyframes animate {
            0% {
              transform: translate(-50%, -75%) rotate(0deg);
            }
            100% {
              transform: translate(-50%, -75%) rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default SearchedProduct;