import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaUtensils, FaEnvelope, FaEnvelopeOpen, FaTimes, FaCarrot, FaListOl, FaPen, FaUser, FaBox, FaHeart, FaTag } from 'react-icons/fa';

const Recipes = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('type');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!category) {
        setError('No category specified');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/category/${encodeURIComponent(category)}`);
        setRecipes(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching recipes');
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [category]);

  const toggleCard = (recipeId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    console.log('Toggling card:', recipeId, 'Current expanded:', expandedCard); // Debug
    setExpandedCard(expandedCard === recipeId ? null : recipeId);
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container">
      <h1 className="title">{category} Recipes</h1>
      {recipes.length === 0 ? (
        <p className="no-recipes">No recipes found in this category.</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className={`recipe-card ${expandedCard === recipe._id ? 'expanded' : ''}`}
              onClick={(e) => toggleCard(recipe._id, e)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && toggleCard(recipe._id, e)}
            >
              <div className="card-front">
                <FaUtensils className="card-icon" />
                <h2 className="card-title">{recipe.title}</h2>
                <p className="card-category">
                  <FaTag className="inline-icon" /> {recipe.category}
                </p>
                {expandedCard !== recipe._id ? (
                  <FaEnvelope className="toggle-icon" />
                ) : (
                  <FaEnvelopeOpen className="toggle-icon" />
                )}
              </div>
              {expandedCard === recipe._id && (
                <div className="card-details">
                  <button
                    className="close-btn"
                    onClick={(e) => toggleCard(recipe._id, e)}
                  >
                    <FaTimes />
                  </button>
                  {recipe.description && (
                    <div className="details-section">
                      <h3 className="details-heading">
                        <FaPen className="inline-icon" /> Description
                      </h3>
                      <p className="details-description">{recipe.description}</p>
                    </div>
                  )}
                  <div className="details-section">
                    <h3 className="details-heading">
                      <FaCarrot className="inline-icon" /> Ingredients
                    </h3>
                    <ul className="details-list">
                      {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="details-section">
                    <h3 className="details-heading">
                      <FaListOl className="inline-icon" /> Steps
                    </h3>
                    <ol className="details-list ordered">
                      {recipe.steps.map((step, index) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  {recipe.createdBy && (
                    <p className="details-meta">
                      <FaUser className="inline-icon" /> Created by: {recipe.createdBy.sellerName}
                    </p>
                  )}
                  {recipe.productName && (
                    <p className="details-meta">
                      <FaBox className="inline-icon" /> Product: {recipe.productName}
                    </p>
                  )}
                  <div className="details-footer">
                    <FaHeart className="heart-icon" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <style>
        {`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background: #f5f5f5;
          }

          .title {
            font-size: 2.5rem;
            font-weight: bold;
            color: #001b1c;
            margin-bottom: 2rem;
            text-transform: capitalize;
            text-align: center;
          }

          .no-recipes {
            text-align: center;
            font-size: 1.2rem;
            color: #001b1c;
          }

          .recipe-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2.5rem;
          }

          .recipe-card {
            background: linear-gradient(135deg, #001b1c, #4cd7d0);
            border-radius: 12px;
            padding: 1.5rem;
            color: #f5f5f5;
            cursor: pointer;
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            overflow: hidden;
            z-index: 1;
            min-height: 200px;
            align-self: start;
          }

          .recipe-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 27, 28, 0.6);
          }

          .recipe-card.expanded {
            transform: rotateX(2deg);
            box-shadow: 0 12px 30px rgba(0, 27, 28, 0.7);
            z-index: 2;
          }

          .recipe-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 60px;
            background: rgba(255, 255, 255, 0.15);
            clip-path: polygon(0 0, 100% 0, 50% 100%);
            z-index: 1;
            transition: transform 0.3s ease;
          }

          .recipe-card:hover::before {
            transform: scale(1.05);
          }

          .card-front {
            position: relative;
            z-index: 2;
            text-align: center;
          }

          .card-icon {
            font-size: 2.2rem;
            color:rgb(255, 255, 255);
            margin-bottom: 1rem;
          }

          .card-title {
            font-size: 1.6rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          .card-category {
            font-size: 1rem;
            color: #d1f3f2;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
          }

          .toggle-icon {
            font-size: 1.4rem;
            color:rgb(255, 255, 255);
            margin-top: 1rem;
          }

          .card-details {
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid #d1f3f266;
            animation: slideDown 0.4s ease;
          }

          @keyframes slideDown {
            from {
              opacity: 0;
              max-height: 0;
            }
            to {
              opacity: 1;
              max-height: 1200px;
            }
          }

          .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: #ff6f61;
            color: #f5f5f5;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.1rem;
            transition: background 0.3s ease;
            z-index: 3;
          }

          .close-btn:hover {
            background: #e65a50;
          }

          .details-section {
            margin-bottom: 1.5rem;
          }

          .details-heading {
            font-size: 1.3rem;
            font-weight: 500;
            color: #d1f3f2;
            margin-bottom: 0.75rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .inline-icon {
            color:rgb(255, 255, 255);
            font-size: 1.2rem;
          }

          .details-description {
            font-size: 1rem;
            color: #f5f5f5;
          }

          .details-list {
            font-size: 1rem;
            color: #f5f5f5;
            padding-left: 1.5rem;
          }

          .details-list li {
            margin-bottom: 0.5rem;
          }

          .details-list.ordered {
            list-style-type: decimal;
          }

          .details-meta {
            font-size: 0.9rem;
            color: #d1f3f2;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .details-footer {
            text-align: center;
            margin-top: 1rem;
          }

          .heart-icon {
            font-size: 1.5rem;
            color:rgb(212, 12, 12);
            transition: transform 0.3s ease;
          }

          .heart-icon:hover {
            transform: scale(1.2);
          }

          @media (max-width: 768px) {
            .recipe-grid {
              grid-template-columns: 1fr;
            }

            .title {
              font-size: 2rem;
            }

            .recipe-card {
              padding: 1.2rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Recipes;