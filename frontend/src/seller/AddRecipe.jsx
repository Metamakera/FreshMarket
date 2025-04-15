import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUtensils, FaBreadSlice, FaCarrot, FaHotjar, FaGlassMartini, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styled from "styled-components";

const AddRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [stock, setStock] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState([""]); // Corrected syntax

  const [formOpen, setFormOpen] = useState(false);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [notification, setNotification] = useState({ show: false, success: false, message: "" });

  const sellerId = localStorage.getItem("sellerId");
  const sellerName = localStorage.getItem("sellerName");

  // Fetch seller's recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/recipes/seller/${sellerId}`);
        setRecipes(res.data);
      } catch (err) {
        console.error("Error fetching recipes", err);
      }
    };
    fetchRecipes();
  }, [sellerId]);

  // Fetch seller's products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, [sellerId]);

  // Fetch stock and product name when productId changes
  useEffect(() => {
    const fetchStockAndName = async () => {
      if (!productId) return;
      try {
        const stockRes = await axios.get(`http://localhost:5000/api/stock/${productId}`);
        setStock(stockRes.data.stock);

        const selected = products.find((p) => p._id === productId);
        setProductName(selected?.name || "");
      } catch (err) {
        console.error("Error fetching stock or product name", err);
      }
    };
    fetchStockAndName();
  }, [productId, products]);

  const handleStepChange = (value, index) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };

  const addStep = () => setSteps([...steps, ""]);
  const removeStep = (index) => setSteps(steps.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const product = products.find((product) => product._id === productId);
    const productName = product ? product.name : "";

    const payload = {
      title,
      category,
      description: `This is a recipe for ${title}`,
      ingredients: ingredients.split(",").map((ingredient) => ingredient.trim()),
      steps,
      createdBy: {
        sellerId,
        sellerName,
      },
      productName,
    };

    try {
      await axios.post("http://localhost:5000/api/recipes", payload);
      setNotification({ show: true, success: true, message: "Recipe added successfully!" });
      setTitle("");
      setCategory("");
      setProductId("");
      setIngredients("");
      setSteps([""]);
      setStock(null);
    } catch (err) {
      console.error("Error submitting recipe", err);
      setNotification({ show: true, success: false, message: "Failed to add recipe." });
    }
  };

  const handleDismiss = () => {
    setNotification({ show: false, success: false, message: "" });
  };

  return (
    <div>
      {/* Recipe Cards */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "3rem auto",
          padding: "2rem",
          background: "#f8fafc",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1e3a8a",
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
            fontWeight: "700",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          My Recipes
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {recipes.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                color: "#4a4a4a",
                fontSize: "1rem",
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              No recipes found. Start by adding a recipe!
            </p>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe._id}
                onClick={() => setExpandedRecipeId(expandedRecipeId === recipe._id ? null : recipe._id)}
                style={{
                  background: expandedRecipeId === recipe._id ? "linear-gradient(135deg, #001b1c, #4cd7d0)" : "#f5f5f5",
                  padding: expandedRecipeId === recipe._id ? "1.5rem" : "1rem",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  height: expandedRecipeId === recipe._id ? "auto" : "80px",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: expandedRecipeId === recipe._id ? "flex-start" : "center",
                  flexDirection: expandedRecipeId === recipe._id ? "column" : "row",
                  gap: expandedRecipeId === recipe._id ? "1rem" : "0.5rem",
                  fontFamily: "'Times New Roman', Times, serif",
                }}
              >
                {expandedRecipeId === recipe._id ? (
                  <>
                    {/* Header with Decorative Icons */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#f5f5f5",
                        padding: "0.5rem 1rem",
                        borderBottom: "2px solid #001b1c",
                        margin: "-1.5rem -1.5rem 1rem -1.5rem",
                        borderRadius: "10px 10px 0 0",
                        fontFamily: "'Times New Roman', Times, serif",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FaUtensils size={24} color="#001b1c" />
                        <FaBreadSlice size={24} color="#001b1c" />
                        <span
                          style={{
                            fontSize: "2rem",
                            fontWeight: "bold",
                            color: "#001b1c",
                          }}
                        >
                          Recipe
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <FaCarrot size={24} color="#001b1c" />
                        <FaHotjar size={24} color="#001b1c" />
                        <FaGlassMartini size={24} color="#001b1c" />
                      </div>
                    </div>

                    {/* Title Input Area */}
                    <div
                      style={{
                        marginBottom: "1rem",
                        padding: "0.25rem",
                        background: "#d3e9e8",
                        borderRadius: "30px",
                      }}
                    >
                      <input
                        type="text"
                        value={recipe.title}
                        readOnly
                        style={{
                          width: "100%",
                          border: "none",
                          background: "transparent",
                          fontSize: "1.2rem",
                          color: "black",
                          fontFamily: "calibri",
                          padding: "0.25rem",
                        }}
                        placeholder="TITLE:"
                      />
                    </div>

                    {/* Ingredients and Directions */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1.5rem",
                      }}
                    >
                      <div
                        style={{
                          flex: "1",
                          padding: "0.75rem",
                          background: "#e6f3f2",
                          border: "2px solid #001b1c",
                          borderRadius: "8px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.2rem",
                            color: "black",
                            fontWeight: "600",
                            marginBottom: "0.75rem",
                            textTransform: "uppercase",
                            fontFamily: "calibri",
                          }}
                        >
                          Ingredients
                        </p>
                        {recipe.ingredients.map((ingredient, index) => (
                          <div
                            key={index}
                            style={{
                              minHeight: "2rem",
                              background: "#ffffff",
                              borderBottom: "1px solid #001b1c",
                              padding: "0.5rem",
                              marginBottom: "0.5rem",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              fontSize: "1rem",
                              color: "#001b1c",
                              fontFamily: "calibri",
                            }}
                          >
                            {ingredient}
                          </div>
                        ))}
                      </div>
                      <div
                        style={{
                          flex: "1",
                          padding: "0.75rem",
                          background: "#e6f3f2",
                          border: "2px solid #001b1c",
                          borderRadius: "8px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "1.2rem",
                            color: "black",
                            fontWeight: "600",
                            marginBottom: "0.75rem",
                            textTransform: "uppercase",
                            fontFamily: "calibri",
                          }}
                        >
                          Steps
                        </p>
                        {recipe.steps.map((step, index) => (
                          <div
                            key={index}
                            style={{
                              minHeight: "2rem",
                              background: "white",
                              padding: "0.5rem",
                              marginBottom: "0.5rem",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              fontSize: "1rem",
                              color: "#001b1c",
                              fontFamily: "calibri",
                            }}
                          >
                            {step}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FaUtensils size={24} color="#001b1c" />
                    <FaBreadSlice size={24} color="#001b1c" />
                    <span
                      style={{
                        fontSize: "1.2rem",
                        fontWeight: "600",
                        color: "#001b1c",
                        marginLeft: "0.5rem",
                        fontFamily: "'Times New Roman', Times, serif",
                      }}
                    >
                      {recipe.title}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* Button to open the Add Recipe Form */}
        <button
          style={{
            padding: "1rem 1.5rem",
            backgroundColor: "#1e40af",
            color: "white",
            fontSize: "1rem",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            width: "100",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            fontFamily: "'Times New Roman', Times, serif",
          }}
          onClick={() => setFormOpen((prev) => !prev)}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#1d4ed8";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#1e40af";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {formOpen ? "Cancel Add Recipe" : "Add a New Recipe"}
        </button>
      </div>

      {/* Add Recipe Form */}
      <div
        style={{
          maxWidth: "800px",
          margin: "3rem auto",
          padding: "2rem",
          borderRadius: "20px",
          background: "#f0f8ff",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          transition: "all 0.3s ease",
          transform: `translateY(${formOpen ? "0" : "-100%"})`,
          opacity: formOpen ? "1" : "0",
          visibility: formOpen ? "visible" : "hidden",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem",
            fontFamily: "'Times New Roman', Times, serif",
          }}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Recipe Title"
            required
            style={{
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <option value="">Select Category</option>
            <option value="Chef's Recipes">Chef's Recipes</option>
            <option value="How to Clean & Prep Seafood">How to Clean & Prep Seafood</option>
            <option value="Cooking Times by Species">Cooking Times by Species</option>
            <option value="Seasonal Specials">Seasonal Specials</option>
          </select>

          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
            style={{
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.name}
              </option>
            ))}
          </select>

          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ingredients (comma-separated)"
            required
            style={{
              padding: "0.75rem",
              borderRadius: "12px",
              border: "1px solid #ccc",
              fontSize: "1rem",
              minHeight: "100px",
              resize: "vertical",
              fontFamily: "'Times New Roman', Times, serif",
            }}
          />

          <div>
            <h4
              style={{
                color: "#1e3a8a",
                fontSize: "1.25rem",
                marginBottom: "1rem",
                fontWeight: "600",
                fontFamily: "'Times New Roman', Times, serif",
              }}
            >
              Steps
            </h4>
            {steps.map((step, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <input
                  type="text"
                  value={step}
                  onChange={(e) => handleStepChange(e.target.value, index)}
                  placeholder={`Step ${index + 1}`}
                  required
                  style={{
                    flex: "1",
                    padding: "0.75rem",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    fontSize: "1rem",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    fontFamily: "'Times New Roman', Times, serif",
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "#1e40af",
                color: "white",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                fontFamily: "'Times New Roman', Times, serif",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1e40af")}
            >
              Add Step
            </button>
          </div>

          <button
            type="submit"
            style={{
              padding: "0.75rem 1rem",
              backgroundColor: "#1e40af",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
              fontFamily: "'Times New Roman', Times, serif",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#1e40af")}
          >
            Submit Recipe
          </button>
        </form>
      </div>

      {/* Notification Card */}
      {notification.show && (
        <NotificationContainer>
          <BlurBackground />
          <NotificationCard success={notification.success}>
            <div className="flex">
              <div className="flex-shrink-0">
                {notification.success ? (
                  <FaCheckCircle className="success-svg" />
                ) : (
                  <FaTimesCircle className="error-svg" />
                )}
              </div>
              <div className="notification-prompt-wrap">
                <p className="notification-prompt-heading">
                  {notification.success ? "Success" : "Error"}
                </p>
                <div className="notification-prompt-prompt">
                  <p>{notification.message}</p>
                </div>
                <div className="notification-button-container">
                  <button
                    type="button"
                    className="notification-button-main"
                    onClick={() => alert("Viewing status...")}
                  >
                    View Status
                  </button>
                  <button
                    type="button"
                    className="notification-button-secondary"
                    onClick={handleDismiss}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </NotificationCard>
        </NotificationContainer>
      )}
    </div>
  );
};

// Styled Components for Notification
const NotificationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const BlurBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  z-index: 1001;
`;

const NotificationCard = styled.div`
  position: relative;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: ${(props) => (props.success ? "rgb(240 253 244)" : "rgb(254 242 242)")};
  animation: fadeIn 0.3s ease-in-out;
  z-index: 1002;
  width: 320px;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .flex {
    display: flex;
  }

  .flex-shrink-0 {
    flex-shrink: 0;
  }

  .success-svg {
    color: rgb(74 222 128);
    width: 1.25rem;
    height: 1.25rem;
  }

  .error-svg {
    color: rgb(239 68 68);
    width: 1.25rem;
    height: 1.25rem;
  }

  .notification-prompt-wrap {
    margin-left: 0.75rem;
  }

  .notification-prompt-heading {
    font-weight: bold;
    color: ${(props) => (props.success ? "rgb(22 101 52)" : "rgb(153 27 27)")};
  }

  .notification-prompt-prompt {
    margin-top: 0.5rem;
    color: ${(props) => (props.success ? "rgb(21 128 61)" : "rgb(185 28 28)")};
  }

  .notification-button-container {
    display: flex;
    margin-top: 0.875rem;
    margin-bottom: -0.375rem;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
  }

  .notification-button-main {
    padding: 0.375rem 0.5rem;
    background-color: ${(props) => (props.success ? "#ECFDF5" : "#FEE2E2")};
    color: ${(props) => (props.success ? "rgb(22 101 52)" : "rgb(153 27 27)")};
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: bold;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${(props) => (props.success ? "#D1FAE5" : "#FECACA")};
    }
  }

  .notification-button-secondary {
    padding: 0.375rem 0.5rem;
    margin-left: 0.75rem;
    background-color: ${(props) => (props.success ? "#ECFDF5" : "#FEE2E2")};
    color: ${(props) => (props.success ? "#065F46" : "#991B1B")};
    font-size: 0.875rem;
    line-height: 1.25rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: ${(props) => (props.success ? "#D1FAE5" : "#FECACA")};
    }
  }
`;

export default AddRecipe;