import React, { useState, useEffect } from "react";
import ProductListing from "./ProductListing";
import HowItWorks from "./Howitworks";
import "../styles/Home.css";
import Logo from "../assets/Bluewaves.png";
import image1 from "../assets/fresh.jpg";
import image2 from "../assets/securepayement.jpg";
import image3 from "../assets/fastdelivery.jpg";
import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";
import slide4 from "../assets/slide4.jpg";
import { FaFish, FaStore, FaRocket, FaUsers } from "react-icons/fa";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);

  const slides = [slide1, slide2, slide3, slide4];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const faqSection = document.getElementById('faq');
      const faqRect = faqSection.getBoundingClientRect();
  
      if (faqRect.top <= window.innerHeight && faqRect.bottom >= 0) {
        faqSection.classList.add('active-section');
      } else {
        faqSection.classList.remove('active-section');
      }
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleFaq = (index) => {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems[index].classList.toggle("active");
  };

  const handleSellerRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.open("/seller-register", "_blank");
    }, 3000);
  };

  const handleExploreClick = () => {
    const productListingSection = document.querySelector('.product-listing');
    if (productListingSection) {
      productListingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home">
      <div className="hero" style={{
        position: 'relative',
        width: '100%',
        height: '600px',
        overflow: 'hidden',
      }}>
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide}
            alt={`Slide ${index + 1}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit:'revert',
              objectPosition: 'center',
              opacity: currentSlide === index ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          />
        ))}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
        }}>
          <h1 style={{
            fontSize: '3rem',
            marginBottom: '1rem',
          }}>Welcome to Blue Waves</h1>
          <p style={{
            fontSize: '1.5rem',
            marginBottom: '2rem',
          }}>The best marketplace for buying and selling fresh seafood.</p>
          <button 
            onClick={handleExploreClick}
            style={{
              padding: '15px 30px',
              fontSize: '1.2rem',
              fontWeight: '600',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 123, 255, 0.4)',
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#0056b3';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#007bff';
              e.target.style.transform = 'scale(1)';
            }}
            onMouseDown={(e) => {
              e.target.style.transform = 'scale(0.95)';
            }}
            onMouseUp={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
          >
            Explore Products
          </button>
        </div>
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}>
          {slides.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: currentSlide === index ? '#007bff' : '#ccc',
                borderRadius: '50%',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      <ProductListing />

      <section className="why-choose-us">
        <h2>Why Choose Us?</h2>
        <div className="features-container">
          <div className="feature-card">
            <img src={image1} alt="Fresh Products" className="logo" />
            <h3>100% Fresh Products</h3>
            <p>All seafood is directly sourced from trusted fishermen and verified sellers.</p>
          </div>
          <div className="feature-card">
            <img src={image2} alt="Secure Payment" className="logo" />
            <h3>Secure Payment</h3>
            <p>Seamless and safe payment methods ensure a smooth transaction.</p>
          </div>
          <div className="feature-card">
            <img src={image3} alt="Fast Delivery" className="logo" />
            <h3>Fast Delivery</h3>
            <p>We ensure quick and hygienic delivery to maintain freshness.</p>
          </div>
        </div>
      </section>

      <section className="faq" id="faq">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-container">
          <div className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(0)}>
              What types of seafood do you sell?
            </button>
            <div className="faq-answer">
              <p>We offer a wide variety of fresh seafood, including fish, shellfish, and mollusks such as salmon, shrimp, crab, and lobster.</p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(1)}>
              Is your seafood sustainably sourced?
            </button>
            <div className="faq-answer">
              <p>Yes! We source seafood from sustainable fisheries to help protect our oceans and ensure the continued health of marine life.</p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(2)}>
              How fresh is the seafood you sell?
            </button>
            <div className="faq-answer">
              <p>We work with trusted suppliers to get the freshest seafood from the ocean or farm to your door quickly, ensuring the highest quality.</p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(3)}>
              How should I store seafood?
            </button>
            <div className="faq-answer">
              <p>Keep fresh seafood in the fridge and use within 1-2 days. For frozen seafood, store in the freezer until ready to cook.</p>
            </div>
          </div>

          <div className="faq-item">
            <button className="faq-question" onClick={() => toggleFaq(4)}>
              Can I buy seafood in bulk?
            </button>
            <div className="faq-answer">
              <p>Yes, we offer bulk purchasing options for both individual and business customers. Contact us for more details.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="reviews">
        <h2>What Our Customers Say</h2>
        <div className="review-container">
          <div className="review-card">
            <p>"Absolutely fresh and best quality seafood. Highly recommend!"</p>
            <h4>- Alex Thompson</h4>
          </div>
          <div className="review-card">
            <p>"Great pricing and quick delivery. The marketplace is very user-friendly!"</p>
            <h4>- Maria Lopez</h4>
          </div>
          <div className="review-card">
            <p>"As a seller, I found this platform very helpful to reach more customers!"</p>
            <h4>- Chris Wilson</h4>
          </div>
        </div>
      </section>

      <section className="cta-section" style={{
        background: 'linear-gradient(135deg, #007bff 0%, #00c4b4 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url("https://www.transparenttextures.com/patterns/clean-textile.png")',
          opacity: 0.1,
        }}></div>
        <h2 style={{
          fontSize: '2.8rem',
          fontWeight: '700',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}>
          Become a Seller Today
        </h2>
        <p style={{
          fontSize: '1.4rem',
          maxWidth: '800px',
          margin: '0 auto 40px',
          lineHeight: '1.6',
        }}>
          Join Blue Waves and unlock a world of opportunities to sell your fresh seafood to a global market. Our platform makes it easy to reach customers, manage sales, and grow your business with confidence.
        </p>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 25px',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
          }}>
            <FaFish size={30} />
            <span style={{ fontSize: '1.2rem' }}>Premium Seafood Listings</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 25px',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
          }}>
            <FaStore size={30} />
            <span style={{ fontSize: '1.2rem' }}>Easy Store Setup</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 25px',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
          }}>
            <FaRocket size={30} />
            <span style={{ fontSize: '1.2rem' }}>Fast Onboarding</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '15px 25px',
            borderRadius: '10px',
            backdropFilter: 'blur(5px)',
          }}>
            <FaUsers size={30} />
            <span style={{ fontSize: '1.2rem' }}>Wide Customer Reach</span>
          </div>
        </div>
        <button 
          onClick={handleSellerRegister} 
          disabled={loading}
          style={{
            padding: '18px 40px',
            fontSize: '1.3rem',
            fontWeight: '600',
            backgroundColor: '#fff',
            color: '#007bff',
            border: 'none',
            borderRadius: '50px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#f1f1f1';
              e.target.style.transform = 'scale(1.05)';
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#fff';
              e.target.style.transform = 'scale(1)';
            }
          }}
          onMouseDown={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(0.95)';
            }
          }}
          onMouseUp={(e) => {
            if (!loading) {
              e.target.style.transform = 'scale(1.05)';
            }
          }}
        >
          {loading ? (
            <span style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                border: '3px solid #007bff',
                borderTop: '3px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}></div>
              Processing...
            </span>
          ) : (
            'Start Selling Now'
          )}
        </button>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    </div>
  );
};

export default Home;