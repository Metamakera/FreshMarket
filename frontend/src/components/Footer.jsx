import React, { useState } from "react";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedinIn, 
  FaEnvelope, 
  FaPhoneAlt, 
  FaMapMarkerAlt, 
  FaFish, 
  FaShieldAlt 
} from "react-icons/fa";
import "../styles/Footer.css";
import Logo from "../assets/Bluewaves.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Query sent! Email: ${email}, Message: ${query}`);
    setEmail("");
    setQuery("");
  };

  return (
    <footer style={{
      background: 'linear-gradient(180deg, #1a2a44 0%, #0f172a 100%)',
      color: '#f1f5f9',
      padding: '50px 0 30px',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 15px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px',
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'flex-start',
        }}>
          <img 
            src={Logo} 
            alt="Blue Waves Logo" 
            style={{
              maxWidth: '150px',
              height: 'auto',
              marginBottom: '10px',
            }}
          />
          <p style={{
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: '#cbd5e1',
            maxWidth: '300px',
          }}>
            Blue Waves - Your trusted seafood marketplace.
          </p>
        </div>

        {/* About Us Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#60a5fa',
          }}>
            <FaFish size={20} /> About Us
          </h3>
          <p style={{
            fontSize: '0.85rem',
            lineHeight: '1.5',
            color: '#cbd5e1',
            maxWidth: '300px',
          }}>
            Blue Waves connects seafood enthusiasts with trusted fishermen, delivering fresh, sustainable seafood straight from the ocean to your table.
          </p>
        </div>

        {/* Contact Us Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#60a5fa',
          }}>
            <FaEnvelope size={20} /> Contact Us
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaEnvelope size={16} /> support@bluewaves.com
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaPhoneAlt size={16} /> +91 98765 43210
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaMapMarkerAlt size={16} /> 123 Ocean St, Chennai, India
            </p>
          </div>
          <form onSubmit={handleSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '15px',
          }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '10px',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                background: '#1e293b',
                color: '#f1f5f9',
                outline: 'none',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = '#4b5563'}
            />
            <textarea
              placeholder="Your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              style={{
                padding: '10px',
                fontSize: '0.85rem',
                borderRadius: '6px',
                border: '1px solid #4b5563',
                background: '#1e293b',
                color: '#f1f5f9',
                outline: 'none',
                resize: 'vertical',
                minHeight: '80px',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#60a5fa'}
              onBlur={(e) => e.target.style.borderColor = '#4b5563'}
            />
            <button 
              type="submit"
              style={{
                padding: '10px',
                fontSize: '0.85rem',
                fontWeight: '600',
                backgroundColor: '#60a5fa',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#60a5fa';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <FaEnvelope size={16} /> Send Query
            </button>
          </form>
        </div>

        {/* Terms & Conditions Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#60a5fa',
          }}>
            <FaShieldAlt size={20} /> Terms & Conditions
          </h3>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFish size={14} /> Final sales for perishable goods.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFish size={14} /> Verify quality before purchase.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFish size={14} /> Sustainable sourcing commitment.
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaFish size={14} /> No cancellations post-processing.
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#60a5fa',
          }}>
            <FaFish size={20} /> Connect With Us
          </h3>
          <ul style={{
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {[
              { icon: <FaFacebookF size={18} />, name: 'Facebook', url: 'https://www.facebook.com' },
              { icon: <FaInstagram size={18} />, name: 'Instagram', url: 'https://www.instagram.com' },
              { icon: <FaTwitter size={18} />, name: 'Twitter', url: 'https://twitter.com' },
              { icon: <FaLinkedinIn size={18} />, name: 'LinkedIn', url: 'https://www.linkedin.com' },
            ].map((social, index) => (
              <li key={index}>
                <a 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    fontSize: '0.85rem',
                    padding: '8px',
                    borderRadius: '6px',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.color = '#60a5fa';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#cbd5e1';
                  }}
                >
                  {social.icon}
                  {social.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid #4b5563',
        marginTop: '40px',
        padding: '15px 0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: '#94a3b8',
      }}>
        <p>© {new Date().getFullYear()} Blue Waves. All Rights Reserved. | Developed by Team 5</p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer {
            padding: 30px 0 20px;
          }
          footer > div {
            grid-template-columns: 1fr;
            gap: 25px;
          }
          h3 {
            font-size: 1.2rem !important;
          }
          p, ul li, input, textarea, button, a {
            font-size: 0.8rem !important;
          }
          img {
            max-width: 120px !important;
          }
        }
        @media (max-width: 480px) {
          h3 {
            font-size: 1.1rem !important;
          }
          p, ul li, input, textarea, button, a {
            font-size: 0.75rem !important;
          }
          input, textarea {
            padding: 8px !important;
          }
          button {
            padding: 8px !important;
          }
          img {
            max-width: 100px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;