import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FaArrowRight, FaTrash } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';
import { Card, Button, Row, Col } from "react-bootstrap";

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
        <Row xs={1} sm={2} md={3} className="g-4">
          {orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            orders.map((order) => (
              <Col key={order._id}>
                <Card className="position-relative">
                  <FaTrash
                    className="position-absolute top-0 end-0 m-2 text-danger"
                    style={{ cursor: "pointer", fontSize: "1.2rem" }}
                    onClick={() => removeOrder(order._id)}
                  />
                  <Card.Body>
                    <Card.Title>Order ID: {order.orderId || "N/A"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{order.userEmail || "No email available"}</Card.Subtitle>
                    <Card.Text>
                      <strong>Total Product Price:</strong> ${order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00"}
                      <br />
                      <strong>Discount:</strong> {order.discountPercentage || "0"}%
                      <br />
                      <strong>Shipping Cost:</strong> ${order.shippingCost ? order.shippingCost.toFixed(2) : "0.00"}
                      <br />
                      <strong>Total Amount:</strong> ${order.totalAmount ? order.totalAmount.toFixed(2) : "0.00"}
                      <br />
                      <strong>Coupon Code:</strong> {order.couponCode || "No coupon used"}
                      <br />
                      <strong>Status:</strong>
                      <span className={`ms-2 ${order.status === "Completed" ? "text-success fw-bold" : ""}`}>
                        {order.status || "Pending"}
                      </span>
                    </Card.Text>
                    <div className="d-flex justify-content-end">
                      <Link to={`/orderdetails/${order._id}`} className="btn btn-primary">
                        Details <FaArrowRight className="ms-1" />
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderHistory;
