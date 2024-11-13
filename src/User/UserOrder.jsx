import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Typography, Card, CardContent, Grid, useMediaQuery } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import "react-toastify/dist/ReactToastify.css";
import "./UserOrderHistory.css";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:600px)");
  const userEmail = JSON.parse(localStorage.getItem("user"))?.token.email; // Assuming user's email is stored here.

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://m-store-server-ryl5.onrender.com/api/orders");
        const userOrders = response.data.filter(order => order.userEmail === userEmail);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch your order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [userEmail]);

  return (
    <div className="container">
      <Helmet>
        <title>Order History - ECommerce</title>
      </Helmet>
      <h2 className="text-center mt-4 mb-4">Your Order History</h2>

      {loading ? (
        <p>Loading...</p>
      ) : isMobile ? (
        // Card layout for mobile
        <Grid container spacing={2}>
          {orders.length === 0 ? (
            <Typography variant="body1" className="text-center">No orders found.</Typography>
          ) : (
            orders.map((order, index) => (
              <Grid item xs={12} key={order._id}>
                <Card variant="outlined" className="order-card">
                  <CardContent>
                    <Typography variant="h6" component="h2" gutterBottom>
                      Order {index + 1}
                    </Typography>
                    <div className="order-info">
                      <Typography variant="body2">Order ID:</Typography>
                      <Typography variant="body1">{order.orderId || "N/A"}</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Total Product Price:</Typography>
                      <Typography variant="body1">${order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00"}</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Discount:</Typography>
                      <Typography variant="body1">{order.discountPercentage || "0"}%</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Shipping Cost:</Typography>
                      <Typography variant="body1">${order.shippingCost ? order.shippingCost.toFixed(2) : "0.00"}</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Total Amount:</Typography>
                      <Typography variant="body1">${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Coupon Code:</Typography>
                      <Typography variant="body1">{order.couponCode || "No coupon used"}</Typography>
                    </div>
                    <div className="order-info">
                      <Typography variant="body2">Status:</Typography>
                      <Typography variant="body1" style={{ color: order.status === "Paid" ? "green" : "red" }}>
                        {order.status || "Pending"}
                      </Typography>
                    </div>
                    {order.status === "Paid" && (
                      <Link to={`/paymentdetails/${order._id}`} style={{ textDecoration: "none", marginLeft: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", color: "inherit" }}>
                          <Typography variant="body2">Payment Details</Typography>
                          <ArrowOutwardIcon sx={{ fontSize: 15, ml: 0.5 }} />
                        </div>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      ) : (
        // Table layout for desktop
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Index</th>
              <th>Order ID</th>
              <th>Total Product Price</th>
              <th>Discount</th>
              <th>Shipping Cost</th>
              <th>Total Amount</th>
              <th>Coupon Code</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.orderId || "N/A"}</td>
                  <td>${order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00"}</td>
                  <td>{order.discountPercentage || "0"}%</td>
                  <td>${order.shippingCost ? order.shippingCost.toFixed(2) : "0.00"}</td>
                  <td>${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}</td>
                  <td>{order.couponCode || "No coupon used"}</td>
                  <td style={{ color: order.status === "Paid" ? "green" : "red" }}>
                    {order.status || "Pending"}
                    {order.status === "Paid" && (
                      <Link to={`/paymentdetails/${order._id}`} style={{ textDecoration: "none", marginLeft: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", color: "inherit" }}>
                          <Typography variant="body2">Details</Typography>
                          <ArrowOutwardIcon sx={{ fontSize: 15, ml: 0.5 }} />
                        </div>
                      </Link>
                    )}
                  </td>
                  <td>
                    <Link to={`/orderdetails/${order._id}`} className="btn btn-primary btn-sm me-2">
                      Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserOrderHistory;
