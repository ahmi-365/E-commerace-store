import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import AppNavbar from "./Components/Navbar/Navbar";
import ProductForm from "./Components/Admin/ProductForm";
import ProductList from "./Components/Admin/ProductList";
import QuantityEdit from "./Components/Product/Cart";
import Home from "./Components/Home/Home";
import OrderHistory from "./Components/Admin/OrderHistory";
import ProductDetails from "./Components/Product/ProductDetails";
import OrderDetails from "./Components/OrderHistory/OrderDetails";
import Account from "./Components/Auth/Account";
import SignUp from "./Components/Auth/Signup";
import Login from "./Components/Auth/Login";
import User from "./Components/Auth/User";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Make sure this is loaded only once
import "./App.css";
import Coupon from "./Components/Coupon/Coupen";
import ApplyCoupen from "./Components/Coupon/ApplyCoupen";
import CoupenHistory from "./Components/Coupon/CoupenHistory";
import LoadingSpinner from "./Components/Spinner/LoadingSpinner";
import PaymentDetails from "./Components/OrderHistory/PaymentDetails";
import AdminDash from "./Components/Admin/AdminDash";
import ProtectedRoute from "./Components/Admin/ProtectedRoute";
import RoleManage from "./Components/Admin/RoleManage";
import UserManagement from "./Components/Admin/UserManagment";
import UserProductList from "./Components/Product/UserProduct";
import AdminPage from "./Components/Admin/AdminPage";
import UserOrderHistory from "./Components/OrderHistory/UserOrder";
import DataDeletionPage from "./Components/Auth/DataDeletionPage";
import FBookLogin from "./Components/Auth/FBookLogin";
import FacebookCallback from "./Components/Auth/FacebookCallback";

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
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://m-store-server-ryl5.onrender.com/api/products"
      );
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
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.isLoggedIn) {
      setIsLoggedIn(true);
      setUserEmail(user.email);
      setUserId(user.id);

      // Check if the email matches admin's email and update `isAdmin` state
      setIsAdmin(user.email === "admin@gmail.com"); // Set to true if the user is admin
    }
  }, []); // Empty dependency array to run once on component mount

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

  const calculateCartCount = (items) =>
    items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error("Invalid product:", product);
      return; // Exit early if product is invalid
    }

    const existingItem = cartItems.find((item) => item._id === product._id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...existingItem, quantity: existingItem.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, quantity) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  };
  const AuthenticatedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user")); // Check user data in localStorage
    const isLoggedIn = user?.isLoggedIn;
  
    if (!isLoggedIn) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
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
      const response = await fetch(
        `https://m-store-server-ryl5.onrender.com/api/products/${productId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (error) {
      alert("Failed to delete the product. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Clear user data from localStorage
    setIsLoggedIn(false);
    setUserEmail("");
    setUserId(null);
    setIsAdmin(false); // Reset admin state
    resetCart();
    toast.success("Logged out successfully.");
  };
 
  const handleLogin = (token, email, id) => {
    const user = { isLoggedIn: true, token, email, id };
    localStorage.setItem("user", JSON.stringify(user));
    setIsLoggedIn(true);
    setUserEmail(email); // Store user email in state
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
        isAdmin={isAdmin} // Pass isAdmin as a prop
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
          {/* Unprotected Routes */}
          <Route
            path="/UserProductList"
            element={
              <UserProductList
                products={products}
                addToCart={addToCart}
                deleteProduct={deleteProduct}
              />
            }
          />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/fblogin" element={<FBookLogin />} />
          <Route path="/facebook/callback" element={<FacebookCallback />} />
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />


        
          {/* Protected Routes */}
          <Route
            path="*"
            element={
              <AuthenticatedRoute>
                <Routes>
                  <Route
                    path="/add-product"
                    element={
                      <ProtectedRoute requiredPermissions={["manageProducts"]}>
                        <ProductForm fetchProducts={fetchProducts} />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/rolemanage"
                    element={<ProtectedRoute superAdminOnly={true} />}
                  >
                    <Route path="" element={<RoleManage />} />
                  </Route>
                  <Route
                    path="/admindash"
                    element={<ProtectedRoute superAdminOnly={true} />}
                  >
                    <Route path="" element={<AdminDash />} />
                  </Route>
                  <Route
                    path="/products"
                    element={
                      <ProtectedRoute requiredPermissions={["manageProducts"]} />
                    }
                  >
                    <Route
                      path=""
                      element={
                        <ProductList
                          products={products}
                          addToCart={addToCart}
                          deleteProduct={deleteProduct}
                        />
                      }
                    />
                  </Route>
                  <Route
                    path="/orderhistory"
                    element={<ProtectedRoute requiredPermissions={["viewOrders"]} />}
                  >
                    <Route path="" element={<OrderHistory />} />
                  </Route>
                  <Route
                    path="/usermanage"
                    element={<ProtectedRoute requiredPermissions={["manageUsers"]} />}
                  >
                    <Route path="" element={<UserManagement />} />
                  </Route>
                  <Route
                    path="/cart"
                    element={
                      <QuantityEdit
                        cartItems={cartItems}
                        updateQuantity={updateQuantity}
                        removeItem={removeItem}
                        resetCart={resetCart}
                        isLoggedIn={isLoggedIn}
                      />
                    }
                  />
                  <Route
                    path="/product/:id"
                    element={<ProductDetails addToCart={addToCart} />}
                  />
                  <Route path="/OrderDetails/:orderId" element={<OrderDetails />} />
                  <Route
                    path="/account"
                    element={
                      <Account
                        isLoggedIn={isLoggedIn}
                        handleLogout={handleLogout}
                        userEmail={userEmail}
                      />
                    }
                  />
                  <Route
                    path="/adminpage"
                    element={
                      <ProtectedRoute superAdminOnly={true}>
                        <AdminPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/user" element={<User userId={userId} />} />
                  <Route path="/coupen" element={<Coupon />} />
                  <Route path="/coupenhistory" element={<CoupenHistory />} />
                  <Route path="/Order-history" element={<UserOrderHistory />} />
                  <Route path="/applycoupen" element={<ApplyCoupen />} />
                  <Route path="/deletion" element={<DataDeletionPage />} />
                  <Route path="/paymentdetails/:id" element={<PaymentDetails />} />
                </Routes>
              </AuthenticatedRoute>
            }
          />
        </Routes>
        )}
      </div>
    </>
  );
};

export default App;
