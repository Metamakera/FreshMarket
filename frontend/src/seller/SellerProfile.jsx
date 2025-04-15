import { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";

const SellerProfile = () => {
  const [sellerData, setSellerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const sellerId = localStorage.getItem("sellerId");

  useEffect(() => {
    if (sellerId) {
      fetchSellerData(sellerId);
    }
  }, [sellerId]);

  const fetchSellerData = async (sellerId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/seller/${sellerId}`);
      setSellerData(response.data.seller);
      setUpdatedData(response.data.seller);
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }
  };

  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        formData.append(key, updatedData[key]);
      });
      if (profileImage) formData.append("profileImage", profileImage);

      await axios.put(`http://localhost:5000/api/seller/${sellerId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
      fetchSellerData(sellerId);
      setEditMode(false);
    } catch (error) {
      console.error("Error updating seller profile:", error);
    }
  };

  if (!sellerData) return <div>Loading...</div>;

  const avatarLetter = sellerData.email?.charAt(0).toUpperCase() || "";

  return (
    <StyledWrapper>
      <div className="card">
        <div className="header">
          <div className="avatar">{avatarLetter}</div>
          <div className="details">
            <h2>{sellerData.name}</h2>
            <p>{sellerData.email}</p>
          </div>
        </div>
        <div className="info-card">
          <div className="info-item">
            <span className="label">Location</span>
            <span className="value">{sellerData.location}</span>
          </div>
        </div>
        <div className="business-info-card">
          <h3 className="business-heading">Business Information</h3>
          <div className="business-info">
            <div><strong>Business Name:</strong> {sellerData.businessName}</div>
            <div><strong>Address:</strong> {sellerData.address}</div>
            <div><strong>GSTIN:</strong> {sellerData.gstin}</div>
            <div><strong>PAN:</strong> {sellerData.panCardNumber}</div>
            <div><strong>Bank Details:</strong> {sellerData.accDetails}</div>
          </div>
        </div>
        {!editMode && (
          <button className="edit-button" onClick={() => setEditMode(true)}>
            Edit Profile
          </button>
        )}
        {editMode && (
          <div className="edit-section">
            <input name="name" value={updatedData.name} onChange={handleChange} placeholder="Name" />
            <input name="email" value={updatedData.email} onChange={handleChange} placeholder="Email" />
            <input name="location" value={updatedData.location} onChange={handleChange} placeholder="Location" />
            <input name="contact" value={updatedData.contact} onChange={handleChange} placeholder="Contact" />
            <input type="file" onChange={handleImageChange} />
            <button onClick={handleUpdate}>Save</button>
          </div>
        )}
      </div>
    </StyledWrapper>
  );
};

export default SellerProfile;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 3rem;

  .card {
    position: relative;
    width: 100%;
    max-width: 500px;
    border-radius: 1.5rem;
  background: linear-gradient(135deg, #001b1c, #4cd7d0);
    padding: 2rem;
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  .header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .avatar {
    width: 5rem;
    height: 5rem;
    background: #3b82f6;
    border-radius: 0.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }

  .details h2 {
    font-size: 1.75rem;
    margin: 0;
    color: #fff;
  }

  .details p {
    font-size: 0.9rem;
    color: #bfdbfe;
    margin-top: 0.25rem;
  }

  .info-card, .business-info-card {
    background: #fff;
    border-radius: 1rem;
    padding: 1.25rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    color: #333;
  }

  .info-item {
    display: flex;
    flex-direction: column;
  }

  .label {
    font-size: 0.9rem;
    color: #666;
  }

  .value {
    font-size: 1rem;
    font-weight: 600;
    color: #1e3a8a;
    margin-top: 0.25rem;
  }

  .business-info-card {
    margin-top: 1rem;
  }

  .business-heading {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    color: #1e3a8a;
    border-bottom: 2px solid #f59e0b;
    display: inline-block;
    padding-bottom: 4px;
  }

  .business-info {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: #666;
  }

  .business-info strong {
    color: #1e3a8a;
  }

  .edit-button {
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background 0.3s ease;
    width: 100%;
  }

  .edit-button:hover {
    background-color: #1e40af;
  }

  .edit-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .edit-section input {
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    font-size: 0.9rem;
  }

  .edit-section button {
    background-color: #2563eb;
    color: white;
    padding: 0.75rem;
    font-size: 0.9rem;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
  }

  .edit-section button:hover {
    background-color: #1e40af;
  }
`;