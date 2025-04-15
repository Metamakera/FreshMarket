const express = require("express");
const { getProductsByName, getImageById , getProductById} = require("../controllers/renderProductController");

const router = express.Router();

// ✅ Fetch Products by Name
router.get("/name/:name", getProductsByName);

// ✅ Fetch Image by Image ID
router.get("/image/:id", getImageById);

router.get("/product/:productId", getProductById); // ✅ Added this route


module.exports = router;
