const Product = require("../models/Product");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// ✅ Fetch Products by Name (Partial & Case-Insensitive Search)
const getProductsByName = async (req, res) => {
  try {
    const { name } = req.params;

    // Case-insensitive and partial match search
    const products = await Product.find({ name: { $regex: new RegExp(name, "i") } });

    if (!products.length) {
      return res.status(404).json({ message: "No products found with this name" });
    }

    // Fetch images along with products
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageId) {
          imageUrl = `http://localhost:5000/api/render-products/image/${product.imageId}`;
        }

        return {
          ...product._doc,
          imageUrl,
        };
      })
    );

    res.json(productsWithImages);
  } catch (error) {
    console.error("Error fetching products by name:", error);
    res.status(500).json({ error: "Error fetching products by name" });
  }
};

// ✅ Fetch a Single Product by Product ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log(`🔍 Fetching product by ID: ${productId}`);

    const product = await Product.findOne({ productId });

    if (!product) {
      console.error("❌ Product not found");
      return res.status(404).json({ message: "Product not found" });
    }

    let imageUrl = null;
    if (product.imageId) {
      imageUrl = `http://localhost:5000/api/render-products/image/${product.imageId}`;
    }

    res.json({ ...product._doc, imageUrl });
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error });
  }
};

// ✅ Fetch Image by ID (for Display)
const getImageById = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    res.setHeader("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("❌ Invalid image ID:", error);
    res.status(500).json({ error: "Invalid image ID" });
  }
};

module.exports = { getProductsByName, getProductById, getImageById };
