const express = require('express');
const { addProduct, getSellerProducts, getProductById, deleteProduct,updateProduct , getProductIds} = require('../controllers/productController'); // ✅ Import deleteProduct
const multer = require('multer');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Route to Add a Product with Image
router.post('/add', upload.single('image'), addProduct);

// ✅ Route to Fetch All Products of a Seller
router.get('/seller/:sellerId', getSellerProducts);

// ✅ Route to Fetch Product by Product ID
router.get('/product/:productId', getProductById);

// ✅ Route to Delete Product by Product ID
router.delete('/delete/:productId', deleteProduct);

router.put("/update/:productId", updateProduct);

router.get("/ids",getProductIds);

module.exports = router;
