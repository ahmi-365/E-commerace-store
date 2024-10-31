import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import AppNavbar from "./Navbar";
import ProductForm from "./ProductForm";
import ProductList from "./ProductList";
import QuantityEdit from "./Cart";
import Payment from "./Payment";
import Home from "./Home";
import OrderHistory from "./OrderHistory";
import OrderSuccess from "./OrderSuccess";
import ProductDetails from "./ProductDetails";
import OrderDetails from "./OrderDetails";
import Account from "./Account";
import SignUp from "./Signup";
import Login from "./Login";
import User from "./User";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is loaded only once
import './App.css';
import Coupon from "./Coupen";
import ApplyCoupen from "./ApplyCoupen";
import CoupenHistory from "./CoupenHistory";
import LoadingSpinner from "./LoadingSpinner";

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://m-store-server-ryl5.onrender.com/api/products");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isLoggedIn) {
      setIsLoggedIn(true);
      setUserEmail(user.email);
      setUserId(user.id);
    }
  }, []);

  useEffect(() => {
    setCartCount(calculateCartCount(cartItems));
  }, [cartItems]);

  const calculateCartCount = (items) => items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error("Invalid product:", product);
      return; // Exit early if product is invalid
    }
    
    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      setCartItems(cartItems.map((item) =>
        item._id === product._id ? { ...existingItem, quantity: existingItem.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(cartItems.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter((item) => item._id !== itemId));
  };

  const resetCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  const deleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://m-store-server-ryl5.onrender.com/api/products/${productId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (error) {
      alert("Failed to delete the product. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    setIsLoggedIn(false);
    setUserEmail("");
    setUserId(null);
    resetCart();
    toast.success("Logged out successfully."); // Trigger toast
  };

  const handleLogin = (token, email, id) => {
    const user = { isLoggedIn: true, token, email, id };
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUserEmail(email);  // Store user email in state
    setUserId(id);
    navigate("/products");
    toast.success("Logged in successfully."); // Trigger toast
  };

  const handleCartClick = () => {
    if (!isLoggedIn) {
      toast.info("You are in guest mode. Redirecting to login page...", {
        autoClose: 2000,
        onClose: () => navigate("/login"),
      });
    } else {
      navigate("/cart");
    }
  };

  return (
    <>
      <AppNavbar
        cartCount={cartCount}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        handleLogout={handleLogout}
        handleCartClick={handleCartClick}
      />
      {/* <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover theme="light" /> */}
      <div className="container mt-4">
      {loading ? (
    <LoadingSpinner message="Loading products..." />
  ) : error ? (
    <div className="text-danger">{error}</div>
  ) : (
          <Routes>
            <Route path="/add-product" element={<ProductForm fetchProducts={fetchProducts} />} />
            <Route path="/products" element={<ProductList products={products} addToCart={addToCart} deleteProduct={deleteProduct} />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/cart" element={<QuantityEdit cartItems={cartItems} updateQuantity={updateQuantity} removeItem={removeItem} resetCart={resetCart} />} />
            <Route path="/payment" element={<Payment cartItems={cartItems} />} />
            <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} />} />
            <Route path="/OrderDetails/:orderId" element={<OrderDetails />} />
            <Route path="/account" element={<Account isLoggedIn={isLoggedIn} handleLogout={handleLogout} userEmail={userEmail} />} />
            <Route path="/" element={<Home />} />
            <Route path="/user" element={<User userId={userId} />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/coupen" element={<Coupon />} />
            <Route path="/coupenhistory" element={<CoupenHistory />} />

            <Route path="/applycoupen" element={<ApplyCoupen />} />
            <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          </Routes>
        )}
      </div>
    </>
  );
};

export default App;
