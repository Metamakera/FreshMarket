import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import SellerRegister from "./pages/SellerRegister";
import SellerDashboard from "./seller/SellerDashboard";
import ManageProducts from "./seller/ManageProducts";
import ViewOrders from "./seller/ViewOrders";
import SalesReports from "./seller/SalesReports";
import Messages from "./seller/Messages";
import SellerProfile from "./seller/SellerProfile";
import SearchedProduct from "./pages/SearchProduct";
import ProductDetails from "./pages/ProductDetails"; // ✅ Import ProductDetails Page
import Checkout from "./pages/checkout"; // ✅ Import Checkout Page
import logo from "./assets/Bluewaves.png"; // ✅ Import favicon/logo
import BuyerAuth from "./buyer/BuyerAuth"; // Correct the import path here
import MyCart from "./buyer/Mycart"; // ✅ Import MyCart Page
import MyOrders from "./buyer/MyOrders";
import AddRecipe from "./seller/AddRecipe";
import Recipes from "./buyer/Recipes";

function App() {
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  return (
    <Router>
      <MainLayout setCheckoutProduct={setCheckoutProduct} checkoutProduct={checkoutProduct} />
    </Router>
  );
}

function MainLayout({ setCheckoutProduct, checkoutProduct }) {
  const location = useLocation();

  useEffect(() => {
    const updateTitleAndFavicon = () => {
      const path = location.pathname;
      const favicon = document.querySelector("link[rel='icon']");

      if (!favicon) {
        console.warn("Favicon link not found in the document.");
        return;
      }

      let title = "BlueWave"; // Default title

      switch (true) {
        case path === "/":
          title = "Home - BlueWave";
          break;
        case path === "/auth":
          title = "Login / Signup - BlueWave";
          break;
        case path === "/seller-register":
          title = "Register as Seller - BlueWave";
          break;
        case path.startsWith("/searchedproduct"):
          title = "Search Results - BlueWave";
          break;
        case path.startsWith("/product/"):
          title = "Product Details - BlueWave";
          break;
        case path.startsWith("/checkout"):
          title = "Checkout - BlueWave";
          break;
        case path.startsWith("/seller/dashboard"):
          title = "Seller Dashboard - BlueWave";
          break;
        case path.startsWith("/seller/dashboard/products"):
          title = "Manage Products - BlueWave";
          break;
        case path.startsWith("/seller/dashboard/orders"):
          title = "View Orders - BlueWave";
          break;
        case path.startsWith("/seller/dashboard/profile"):
          title = "Seller Profile - BlueWave";
          break;
        case path.startsWith("/seller/dashboard/sales"):
          title = "Sales Reports - BlueWave";
          break;
        case path.startsWith("/seller/dashboard/messages"):
          title = "Messages - BlueWave";
          break;
        default:
          title = "BlueWave";
          break;
      }

      document.title = title;
      favicon.setAttribute("href", logo);
    };

    updateTitleAndFavicon();
  }, [location.pathname]);

  // ✅ Show Header only for specific routes
  const showHeader = [
    "/", 
    "/searchedproduct", 
    "/checkout/:productId", 
    "/myorders", 
    "/product/:productId"
  ].some(route => location.pathname.startsWith(route));

  // ✅ Show Footer on specific routes (excluding seller dashboard)
  const showFooter = !location.pathname.startsWith("/seller/dashboard");

  return (
    <>
      {showHeader && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/seller-register" element={<SellerRegister />} />
        <Route path="/searchedproduct" element={<SearchedProduct />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/mycart" element={<MyCart />} />
        <Route path="/buyer/auth" element={<BuyerAuth />} /> {/* Correct path for BuyerAuth */}
        <Route path="/recipes" element={<Recipes />} />        Product Details and Checkout
        <Route path="/product/:productId" element={<ProductDetails setCheckoutProduct={setCheckoutProduct} />} />
        <Route path="/checkout/:productId" element={<Checkout />} />

        {/* Seller Dashboard Layout */}
        <Route path="/seller/dashboard/*" element={<SellerDashboard />}>
          <Route path="products" element={<ManageProducts />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="profile" element={<SellerProfile />} />
          <Route path="sales" element={<SalesReports />} />
          <Route path="messages" element={<Messages />} />
          <Route path="addrecipe" element={<AddRecipe />} />
        </Route>
      </Routes>

      {showFooter && <Footer />}
    </>
  );
}

export default App;
