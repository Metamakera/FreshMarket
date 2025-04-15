import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  FaPlus,
  FaTag,
  FaFileAlt,
  FaRupeeSign,
  FaImage,
  FaTrash,
  FaCheckCircle,
} from "react-icons/fa";
import MaximizedProductView from "./MaximizedProductView";

const seaProductCategories = [
  { id: "F-01", name: "Fish" },
  { id: "S-01", name: "Shrimp" },
  { id: "SH-01", name: "Shellfish" },
  { id: "C-01", name: "Cephalopods" },
  { id: "V-01", name: "Vegetation" },
];

function ManageProducts() {
  const sellerId = localStorage.getItem("sellerId");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteInput, setDeleteInput] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
    category: "",
    productId: "",
  });

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/seller/${sellerId}`);
      if (response.status === 200) {
        setProducts(response.data.reverse());
      } else {
        alert("Error fetching products: " + response.data.message);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", productDetails.name);
    formData.append("description", productDetails.description);
    formData.append("price", productDetails.price);
    formData.append("category", productDetails.category);
    formData.append("productId", productDetails.productId);
    formData.append("sellerId", sellerId);
    formData.append("image", productDetails.image);

    try {
      const response = await axios.post("http://localhost:5000/api/products/add", formData);
      if (response.status === 201) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        fetchSellerProducts();
        setProductDetails({
          name: "",
          description: "",
          price: "",
          image: null,
          category: "",
          productId: "",
        });
        setShowAddProduct(false);
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting product:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteInput.toLowerCase() !== "delete") {
      alert("Please type 'delete' to confirm.");
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/products/delete/${deleteProductId}`);
      if (response.status === 200) {
        alert("Product deleted successfully!");
        setProducts((prevProducts) => prevProducts.filter((product) => product.productId !== deleteProductId));
        setDeleteProductId(null);
        setDeleteInput("");
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  return (
    <Container>
      <Header>
        <h2>Manage Your Products</h2>
      </Header>

      <Section>
        <ButtonContainer>
          <AddButton onClick={() => setShowAddProduct(!showAddProduct)}>
            <FaPlus style={{ marginRight: "8px" }} />
            {showAddProduct ? "Close Form" : "Add New Product"}
          </AddButton>
        </ButtonContainer>

        {showAddProduct && (
          <FormSection>
            <FormHeader>
              <h3>Add New Product</h3>
            </FormHeader>
            <Form onSubmit={handleAddProduct}>
              <FormGroup>
                <Label>
                  <FaTag style={{ marginRight: "8px" }} />
                  Category
                </Label>
                <Select
                  value={productDetails.category}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      category: e.target.value,
                      productId: `${e.target.value}-${Date.now()}`,
                    })
                  }
                  required
                >
                  <option value="">-- Select Category --</option>
                  {seaProductCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.id})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaTag style={{ marginRight: "8px" }} />
                  Product Name
                </Label>
                <Input
                  type="text"
                  value={productDetails.name}
                  onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaFileAlt style={{ marginRight: "8px" }} />
                  Description
                </Label>
                <TextArea
                  value={productDetails.description}
                  onChange={(e) => setProductDetails({ ...productDetails, description: e.target.value })}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaRupeeSign style={{ marginRight: "8px" }} />
                  Price
                </Label>
                <Input
                  type="number"
                  value={productDetails.price}
                  onChange={(e) => setProductDetails({ ...productDetails, price: e.target.value })}
                  required
                  min="0"
                  step="0.01"
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  <FaImage style={{ marginRight: "8px" }} />
                  Product Image
                </Label>
                <FileInput
                  type="file"
                  onChange={(e) => setProductDetails({ ...productDetails, image: e.target.files[0] })}
                  required
                />
              </FormGroup>

              <SubmitButton type="submit">
                <FaPlus style={{ marginRight: "8px" }} />
                Add Product
              </SubmitButton>
            </Form>
          </FormSection>
        )}
      </Section>

      {showSuccess && (
        <SuccessOverlay>
          <SuccessModal>
            <CheckCircle>
              <FaCheckCircle size={60} color="#fff" />
            </CheckCircle>
            <SuccessMessage>Product Added Successfully!</SuccessMessage>
          </SuccessModal>
        </SuccessOverlay>
      )}

      {selectedProduct ? (
        <MaximizedProductView
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          refreshProducts={fetchSellerProducts}
          onDeleteProduct={(productId) => setDeleteProductId(productId)}
        />
      ) : (
        <Section>
          <h3>Your Products</h3>
          {loading ? (
            <StatusMessage>Loading products...</StatusMessage>
          ) : products.length === 0 ? (
            <StatusMessage>No products found.</StatusMessage>
          ) : (
            <ProductGrid>
              {products.map((product) => (
                <StyledCard key={product.productId}>
                  <div
                    className="img"
                    style={{ backgroundImage: `url(http://localhost:5000/api/image/${product.imageId})` }}
                    onClick={() => setSelectedProduct(product)}
                  ></div>
                  <div className="text">
                    <p className="h3">{product.name}</p>
                    <p className="p">{product.description}</p>
                    <div className="button-group">
                      <DeleteButton onClick={() => setDeleteProductId(product.productId)}>
                        <FaTrash style={{ marginRight: "6px" }} /> Delete
                      </DeleteButton>
                    </div>
                  </div>
                </StyledCard>
              ))}
            </ProductGrid>
          )}
        </Section>
      )}

      {deleteProductId && (
        <Overlay>
          <StyledModal>
            <div className="card">
              <div className="header">
                <div className="image">
                  <svg
                    aria-hidden="true"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="content">
                  <span className="title">Confirm Delete</span>
                  <p className="message">
                    Type <strong>delete</strong> to confirm deletion of this product. This action cannot be undone.
                  </p>
                  <Input
                    type="text"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                    placeholder="Type 'delete' here"
                  />
                </div>
                <div className="actions">
                  <button className="desactivate" type="button" onClick={handleDeleteConfirm}>
                    Delete
                  </button>
                  <button className="cancel" type="button" onClick={() => {
                    setDeleteProductId(null);
                    setDeleteInput("");
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </StyledModal>
        </Overlay>
      )}
    </Container>
  );
}

// Styled Components
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
  min-height: 100vh;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #1f2937;
    text-align: center;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }
`;

const Section = styled.section`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background:white;
    color:blue;
    border:1px solid blue;
  }

  &:focus {
    outline: none;
    ring: 2px solid #93c5fd;
  }
`;

const FormSection = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f1f5f9;
  border-radius: 10px;
`;

const FormHeader = styled.div`
  margin-bottom: 1rem;
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  font-size: 1rem;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  font-size: 1rem;
  color: #1f2937;
  background: rgb(255, 255, 255);
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  font-size: 1rem;
  color: #1f2937;
  background: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::-webkit-file-upload-button {
    padding: 0.5rem 1rem;
    background: #e5e7eb;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.875rem;
    color: #374151;
  }
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  background: white;
  color: rgb(16, 0, 136);
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid rgb(16, 0, 136);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgb(16, 0, 136);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: white;
  }

  &:focus {
    outline: none;
    ring: 2px solid #6ee7b7;
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-size: 1rem;
  color: #6b7280;
  margin: 2rem 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
`;

const StyledCard = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0px 0px 14px -2px #bebebe;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 8px 20px -2px rgba(0, 0, 0, 0.2);
  }

  .img {
    width: 100%;
    height: 7em;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background-size: cover;
    background-position: center;
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  .text {
    padding: 7px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .text .h3 {
    font-family: system-ui;
    font-size: medium;
    font-weight: 600;
    color: black;
    text-align: center;
  }

  .text .p {
    font-family: system-ui;
    color: #999999;
    font-size: 13px;
    margin: 0px;
    text-align: center;
    padding: 5px;
  }

  .button-group {
    display: flex;
    gap: 10px;
    margin: 10px;
  }
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out, transform 0.2s ease-in-out;

  &:hover {
    background-color: rgb(255, 255, 255);
    color: #dc2626;
    border: 1px solid #dc2626;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.5);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const StyledModal = styled.div`
  .card {
    overflow: hidden;
    position: relative;
    background-color: #ffffff;
    text-align: left;
    border-radius: 0.5rem;
    max-width: 290px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .header {
    padding: 1.25rem 1rem 1rem 1rem;
    background-color: #ffffff;
  }

  .image {
    display: flex;
    margin-left: auto;
    margin-right: auto;
    background-color: #fee2e2;
    flex-shrink: 0;
    justify-content: center;
    align-items: center;
    width: 3rem;
    height: 3rem;
    border-radius: 9999px;
  }

  .image svg {
    color: #dc2626;
    width: 1.5rem;
    height: 1.5rem;
  }

  .content {
    margin-top: 0.75rem;
    text-align: center;
  }

  .title {
    color: #111827;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5rem;
  }

  .message {
    margin-top: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    line-height: 1.25rem;
  }

  .actions {
    margin: 0.75rem 1rem;
    background-color: #f9fafb;
  }

  .desactivate {
    display: inline-flex;
    padding: 0.5rem 1rem;
    background-color: #dc2626;
    color: #ffffff;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border-width: 1px;
    border-color: transparent;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #b91c1c;
    }
  }

  .cancel {
    display: inline-flex;
    margin-top: 0.75rem;
    padding: 0.5rem 1rem;
    background-color: #ffffff;
    color: #374151;
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 500;
    justify-content: center;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    transition: background-color 0.3s ease-in-out;

    &:hover {
      background-color: #f3f4f6;
    }
  }

  button {
    cursor: pointer;
  }
`;

const SuccessOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const SuccessModal = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  text-align: center;
  position: relative;
  animation: pop-in 0.3s ease-out;

  @keyframes pop-in {
    0% {
      transform: scale(0.8);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const CheckCircle = styled.div`
  width: 80px;
  height: 80px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.2);
`;

const SuccessMessage = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
`;

export default ManageProducts;