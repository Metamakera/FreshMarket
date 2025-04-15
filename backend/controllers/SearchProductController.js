const Product = require("../models/Product");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

const conn = mongoose.connection;
let gridFSBucket;

conn.once("open", () => {
  gridFSBucket = new GridFSBucket(conn.db, { bucketName: "uploads" });
});

// ✅ Fetch Products by Category (e.g., "S-01", "F-01") Including Images
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Find products by category ID
    const products = await Product.find({ category: categoryId });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this category" });
    }

    // Fetch images along with products
    const productsWithImages = await Promise.all(
      products.map(async (product) => {
        let imageUrl = null;
        if (product.imageId) {
          imageUrl = `http://localhost:5000/api/searchproduct/image/${product.imageId}`;
        }

        return {
          ...product._doc,
          imageUrl,
        };
      })
    );

    res.status(200).json(productsWithImages);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Fetch Image by Image ID (Rendering from GridFSBucket)
const getImageById = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gridFSBucket.openDownloadStream(fileId);

    res.setHeader("Content-Type", "image/jpeg");
    downloadStream.pipe(res);
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Invalid Image ID" });
  }
};

module.exports = { getProductsByCategory, getImageById };
