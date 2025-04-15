const ProductStock = require("../models/ProductStock");

// ✅ Add Stock for a Product
const addStock = async (req, res) => {
    try {
      const { productId } = req.params;
      const stockQuantity = Number(req.body.stockQuantity); // Ensure it's a number

      if (!stockQuantity || isNaN(stockQuantity) || stockQuantity <= 0) {
        return res.status(400).json({ message: "Stock quantity must be a positive number." });
      }

      let stock = await ProductStock.findOne({ productId });

      if (!stock) {
        stock = new ProductStock({ productId, stockQuantity });
      } else {
        stock.stockQuantity += stockQuantity; // ✅ Now it adds the stock instead of replacing it
        stock.lastUpdated = Date.now();
      }

      await stock.save();

      // ✅ Fetch updated stock and return response
      const updatedStock = await ProductStock.findOne({ productId });

      res.status(201).json({ 
        message: "Stock added successfully", 
        stock: updatedStock 
      });

    } catch (error) {
      res.status(500).json({ message: "Error adding stock", error: error.message });
    }
};

// ✅ Get Stock Details for a Product
const getStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const stock = await ProductStock.findOne({ productId });

    if (!stock) {
      return res.status(404).json({ message: "Stock details not found" });
    }

    res.status(200).json({ stock });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stock details", error: error.message });
  }
};

// ✅ Delete Stock Entry (Optional)
const deleteStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const deletedStock = await ProductStock.findOneAndDelete({ productId });

    if (!deletedStock) {
      return res.status(404).json({ message: "Stock entry not found" });
    }

    res.status(200).json({ message: "Stock entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting stock entry", error: error.message });
  }
};

// ✅ Export the controller functions
module.exports = {
  addStock, // ✅ Changed from `updateStock` to `addStock`
  getStock,
  deleteStock,
};
