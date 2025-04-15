require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const sellerRoutes = require("./routes/sellerRoutes");
const otpRoutes = require("./routes/otpRoutes");
const sellerprofile = require("./routes/sellerprofile");
const productRoutes = require('./routes/productRoutes');
const imageRoutes = require('./routes/imageRoutes');
const renderProductRoutes = require("./routes/renderProductRoutes");
const searchProductRoutes = require("./routes/SearchProductRoutes");
const productStockRoutes = require("./routes/ProductStockRoutes"); 
const buyerRoutes = require("./routes/buyerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const buyerOrderRoutes = require("./routes/buyerOrderRoutes");
const recipeRoutes = require("./routes/recipeRoutes");


const app = express();
app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error:", err));


app.use('/api/seller', sellerRoutes);

app.use("/api/otp", otpRoutes);

app.use("/api/seller", sellerprofile);

app.use('/api/products', productRoutes);

app.use('/api', imageRoutes);

app.use("/api/render-products", renderProductRoutes);

app.use("/api", searchProductRoutes);

app.use("/api/stock", productStockRoutes);

app.use("/api/buyer", buyerRoutes);

app.use("/api/order", orderRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/buyer", buyerOrderRoutes); // 👈 Mount route

// Use recipe routes for handling recipe and video requests
app.use("/api/recipes", recipeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
