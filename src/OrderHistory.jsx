import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        console.log("Fetched Orders:", response.data); // Log fetched orders
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to fetch order history. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const removeOrder = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this order?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
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
      <h2>Your Order History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>User Email</th>
                  <th>Order ID</th>
                  <th>Total Product Price</th>
                  <th>Discount (%)</th>
                  <th>Shipping Cost</th>
                  <th>Total Amount</th>
                  <th>Coupon Code</th> {/* Updated column for Coupon Code */}
                  <th>Status</th>
                  <th>Details</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.userEmail || "No email available"}</td>
                    <td>{order.orderId || "N/A"}</td>
                    <td>${order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00"}</td>
                    <td>{order.discountPercentage != null ? order.discountPercentage : "0"}%</td>
                    <td>${order.shippingCost != null ? order.shippingCost.toFixed(2) : "0.00"}</td>
                    <td>${order.totalAmount != null ? order.totalAmount.toFixed(2) : "0.00"}</td>
                    <td>{order.couponCode || "No coupon used"}</td> {/* Display coupon code used */}
                    <td>{order.status || "Pending"}</td>
                    <td style={{ textAlign: "center" }}>
                      <Link
                        to={`/orderdetails/${order._id}`}
                        style={{
                          textDecoration: "none",
                          color: "#007bff",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Details <FaArrowRight style={{ marginLeft: "5px" }} />
                      </Link>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        onClick={() => removeOrder(order._id)}
                        style={{
                          color: "gray",
                          cursor: "pointer",
                          fontSize: "20px",
                        }}
                      >
                        x
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderHistory;
