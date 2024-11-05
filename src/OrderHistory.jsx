import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import Typography from "@mui/joy/Typography";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

import './OrderHistory.css'; // Create a CSS file for custom styling

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true); 
      try {
        const response = await axios.get("https://m-store-server-ryl5.onrender.com/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch order history. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };

    // Fetch orders initially only once
    fetchOrders();
  }, []);

  const removeOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this order?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`https://m-store-server-ryl5.onrender.com/api/orders/${orderId}`);
      if (response.status === 200 || response.status === 204) {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order removed successfully.");
      } else {
        toast.error("Failed to remove order. Please try again.");
      }
    } catch (error) {
      console.error("Error removing order:", error);
      toast.error("Failed to remove order. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mt-4 mb-4">Your Order History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Email</th>
              <th>Total Product Price</th>
              <th>Discount</th>
              <th>Shipping Cost</th>
              <th>Total Amount</th>
              <th>Coupon Code</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No orders found.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId || "N/A"}</td>
                  <td>{order.userEmail || "No email available"}</td>
                  <td>${order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00"}</td>
                  <td>{order.discountPercentage || "0"}%</td>
                  <td>${order.shippingCost ? order.shippingCost.toFixed(2) : "0.00"}</td>
                  <td>${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</td>
                  <td>{order.couponCode || "No coupon used"}</td>
                  <td style={{ color: order.status === "Paid" ? "green" : "red" }}>
  {order.status === "Paid" ? (
    <strong>{order.status}</strong> // Bold for Paid status
  ) : (
    order.status || "Pending" // Regular text for Pending status
  )}
  {order.status === "Paid" && (
    <Link to={`/paymentdetails/${order._id}`} style={{ textDecoration: 'none', marginLeft: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', color: 'inherit' }}>
        <Typography varient>Details</Typography>
        <ArrowOutwardIcon sx={{ fontSize: 15, ml: 0.5 }} />
      </div>
    </Link>
  )}
</td>

                  <td>
                    <Link to={`/orderdetails/${order._id}`} className="btn btn-primary btn-sm me-2">Details</Link>
                    
                                           
                                                             </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <Helmet>
        <title>Order History - ECommerace</title>
      </Helmet>
      <ToastContainer />
    </div>
  );
};

export default OrderHistory;
