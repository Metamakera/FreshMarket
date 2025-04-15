const Product = require("../models/Product");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const conn = mongoose.connection;
let gridFSBucket;

// ✅ Initialize GridFSBucket Once MongoDB is Connected
conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// ✅ Add a New Product with Image Upload
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, sellerId } = req.body;
    const imageFile = req.file; // Image from Multer

    if (!name || !description || !price || !category || !sellerId || !imageFile) {
      return res.status(400).json({ message: "All fields, including an image, are required." });
    }

    // ✅ Generate Unique Product ID
    const productId = `${category}-${Date.now()}`;

    // ✅ Upload Image to GridFS
    const uploadStream = gridFSBucket.openUploadStream(imageFile.originalname, {
      metadata: { contentType: imageFile.mimetype },
    });

    uploadStream.end(imageFile.buffer);

    uploadStream.on("finish", async () => {
      try {
        // ✅ Save Product with Image ID
        const newProduct = new Product({
          name,
          description,
          price,
          category,
          productId,
          sellerId,
          imageId: uploadStream.id, // ✅ Store GridFS Image ID
        });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });
      } catch (err) {
        console.error("Error saving product:", err);
        res.status(500).json({ message: "Error saving product", error: err.message });
      }
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading image:", err);
      res.status(500).json({ message: "Error uploading image", error: err.message });
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

// ✅ Fetch Products by Seller ID
const getSellerProducts = async (req, res) => {
  try {
    const { sellerId } = req.params;
    const products = await Product.find({ sellerId });

    if (!products.length) return res.status(404).json({ message: "No products found for this seller" });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// ✅ Fetch a Single Product by Product ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findOne({ productId });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// ✅ Delete a Product by Product ID (Including GridFS Image)
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // ✅ Check if Product Exists
    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Delete associated Image from GridFS
    if (product.imageId) {
      try {
        await gridFSBucket.delete(new mongoose.Types.ObjectId(product.imageId));
      } catch (err) {
        console.error("Error deleting image from GridFS:", err);
      }
    }

    // ✅ Delete Product from Database
    await Product.deleteOne({ productId });

    res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

// ✅ Update Product Details (Name, Description, Price)
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, price } = req.body;

    // ✅ Check if Product Exists
    const product = await Product.findOne({ productId });
    if (!product) return res.status(404).json({ message: "Product not found" });

    // ✅ Update Product Fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    await product.save();
    res.status(200).json({ message: "Product updated successfully", product });

  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// ✅ Fetch Only Product IDs from Product Collection
const getProductIds = async (req, res) => {
  try {
    const productIds = await Product.find({}, { productId: 1, _id: 0 });
    const formattedIds = productIds.map((item) => item.productId);

    res.status(200).json({ productIds: formattedIds });
  } catch (error) {
    console.error("Error fetching product IDs:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
};

module.exports = {
  addProduct,
  getSellerProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  getProductIds,
};
