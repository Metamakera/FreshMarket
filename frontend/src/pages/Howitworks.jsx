import { useState } from 'react';

const RecipeSections = () => {
  const [videoId, setVideoId] = useState(null);

  const handleRowClick = (id) => {
    setVideoId(id);
  };

  return (
    <>
      {/* Section 1: Chef's Recipes */}
      <section id="chefs-recipes" className="section chefs-recipes">
        <div className="content-wrapper">
          <div className="left-content">
            <h2>Chef's Recipes</h2>
            <p>Explore mouth-watering seafood dishes crafted by world-class chefs...</p>
            <ul>
              <li>Classic Lobster Bisque</li>
              <li>Grilled Mahi-Mahi with Mango Salsa</li>
              <li>Herb-Crusted Cod with Citrus Aioli</li>
              <li>Shrimp Scampi with Garlic and Wine</li>
            </ul>
          </div>
          <div className="right-content">
            <h3>Watch Our Recipe Videos</h3>
            <p>Get a step-by-step guide to cooking these amazing dishes.</p>
            <div className="video-container">
              {videoId ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Select a recipe to watch the video</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How to Clean & Prep Seafood */}
      <section id="clean-prep" className="section clean-prep">
        <div className="content-wrapper reversed">
          <div className="left-content">
            <h2>How to Clean & Prep Seafood</h2>
            <p>Learn the step-by-step techniques for cleaning, descaling...</p>
            <ul>
              <li>How to fillet a fish in under 5 minutes</li>
              <li>Cleaning shellfish safely</li>
              <li>Tools every seafood prepper should have</li>
            </ul>
          </div>
          <div className="right-content">
            <h3>Watch Cleaning & Prep Techniques</h3>
            <p>Watch the tutorials to become a seafood prep master.</p>
            <div className="video-container">
              {videoId ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Select a video to watch</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Cooking Times by Species */}
      <section id="cooking-times" className="section cooking-times">
        <div className="content-wrapper">
          <div className="left-content">
            <h2>Cooking Times by Species</h2>
            <p>Get precise cooking times for your favorite seafood...</p>
            <table>
              <thead>
                <tr>
                  <th>Seafood</th>
                  <th>Cooking Method</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                <tr onClick={() => handleRowClick('video-id-1')}>
                  <td>Salmon Fillet</td>
                  <td>Grill</td>
                  <td>6-8 mins</td>
                </tr>
                <tr onClick={() => handleRowClick('video-id-2')}>
                  <td>Shrimp</td>
                  <td>Boil</td>
                  <td>3-5 mins</td>
                </tr>
                <tr onClick={() => handleRowClick('video-id-3')}>
                  <td>Crab Legs</td>
                  <td>Steam</td>
                  <td>10-12 mins</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="right-content">
            <h3>Watch Cooking Times Video</h3>
            <div className="video-container">
              {videoId ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Select a row to watch the related video</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Seasonal Specials */}
      <section id="seasonal-specials" className="section seasonal-specials">
        <div className="content-wrapper">
          <div className="left-content">
            <h2>Seasonal Specials</h2>
            <p>Discover what’s in season! Take advantage of the freshest catches...</p>
            <ul>
              <li>Spring: Soft-shell Crab Stir Fry</li>
              <li>Summer: Grilled Tuna with Citrus Marinade</li>
              <li>Fall: Buttery Baked Clams</li>
            </ul>
          </div>
          <div className="right-content">
            <h3>Watch Seasonal Specials Videos</h3>
            <p>Learn how to make the most of seasonal seafood ingredients.</p>
            <div className="video-container">
              {videoId ? (
                <iframe
                  width="560"
                  height="315"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <p>Select a video to watch</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RecipeSections;
