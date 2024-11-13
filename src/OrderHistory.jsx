  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import { ToastContainer, toast } from "react-toastify";
  import { Link } from "react-router-dom";
  import { Helmet } from "react-helmet";
  import { Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, Grid, useMediaQuery, MenuItem } from "@mui/material";
  import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
  import "./OrderHistory.css";
  import "react-toastify/dist/ReactToastify.css";

  const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [startIdx, setStartIdx] = useState("");
    const [endIdx, setEndIdx] = useState("");
    const isMobile = useMediaQuery("(max-width:600px)");

    useEffect(() => {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const response = await axios.get("https://m-store-server-ryl5.onrender.com/api/orders");
          const sortedOrders = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(sortedOrders);
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

    const handleExport = () => {
      setDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setDialogOpen(false);
    };

    const exportToCSV = () => {
      const start = parseInt(startIdx, 10) - 1;
      const end = parseInt(endIdx, 10) - 1;

      if (isNaN(start) || isNaN(end) || start < 0 || end >= orders.length || start > end) {
        toast.error("Please enter a valid index range.");
        return;
      }

      const headers = ["Order ID,Email,Total Product Price,Discount,Shipping Cost,Total Amount,Coupon Code,Status"];
      const rows = orders.slice(start, end + 1).map((order) =>
        [
          order.orderId || "N/A",
          order.userEmail || "No email available",
          order.totalProductPrice ? order.totalProductPrice.toFixed(2) : "0.00",
          `${order.discountPercentage || 0}%`,
          order.shippingCost ? order.shippingCost.toFixed(2) : "0.00",
          order.totalAmount ? order.totalAmount.toFixed(2) : "0.00",
          order.couponCode || "No coupon used",
          order.status || "Pending",
        ].join(",")
      );

      const csvContent = [headers.join("\n"), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order_history_${start + 1}-${end + 1}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDialogOpen(false);
    };

    return (
      <div className="container">
        <Helmet>
          <title>Order History - ECommerce</title>
        </Helmet>
        <h2 className="text-center mt-4 mb-4">Your Order History</h2>

        <Button variant="contained" color="primary" onClick={handleExport}>
          Export CSV
        </Button>

        <Dialog open={dialogOpen} onClose={handleCloseDialog}>
          <DialogTitle>Export Orders to CSV</DialogTitle>
          <DialogContent>
            <TextField
              label="Start Index"
              type="number"
              value={startIdx}
              onChange={(e) => setStartIdx(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="End Index"
              type="number"
              value={endIdx}
              onChange={(e) => setEndIdx(e.target.value)}
              variant="outlined"
              size="small"
              fullWidth
              margin="dense"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={exportToCSV} color="primary">
              Export
            </Button>
          </DialogActions>
        </Dialog>

        {loading ? (
          <p>Loading...</p>
        ) : isMobile ? (
          // Card layout for mobile
          <Grid container spacing={2}>
  {orders.map((order, index) => (
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
            <Typography variant="body2">Email:</Typography>
            <Typography variant="body1">{order.userEmail || "N/A"}</Typography>
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
          {/* New fields added */}
          <div className="order-info">
            <Typography variant="body2">Order Status:</Typography>
            <Typography variant="body1">{order.orderStatus || "N/A"}</Typography> {/* Display Order Status */}
          </div>
          <div className="order-info">
            <Typography variant="body2">Delivery Status:</Typography>
            <TextField
              select
              value={order.deliveryStatus || ""}
              onChange={(e) => {
                // Handle delivery status change (you can implement this)
                const updatedOrders = [...orders];
                const orderIndex = updatedOrders.findIndex(o => o._id === order._id);
                updatedOrders[orderIndex].deliveryStatus = e.target.value;
                setOrders(updatedOrders);
              }}
              variant="outlined"
              size="small"
              fullWidth
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
            </TextField>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Link to={`/orderdetails/${order._id}`}>
              <Button variant="contained" color="primary" size="small" className="me-2">
                Details
              </Button>
            </Link>
            {order.status === "Paid" && (
              <Link to={`/paymentdetails/${order._id}`} style={{ textDecoration: "none", marginLeft: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", color: "inherit" }}>
                  <Typography variant="body2">Payment Details</Typography>
                  <ArrowOutwardIcon sx={{ fontSize: 15, ml: 0.5 }} />
                </div>
              </Link>
            )}
            <span onClick={() => removeOrder(order._id)} style={{ color: "gray", cursor: "pointer", fontSize: "20px" }}>
              x
            </span>
          </div>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

        ) : (
          // Table layout for desktop
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Index</th>
                <th>Order ID</th>
                <th>Email</th>
                <th>Total Product Price</th>
                <th>Discount</th>
                <th>Shipping Cost</th>
                <th>Total Amount</th>
                <th>Coupon Code</th>
                <th>Status</th>
                <th>Actions</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="11" className="text-center">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.orderId || "N/A"}</td>
                    <td>{order.userEmail || "No email available"}</td>
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
                    <td style={{ textAlign: "center" }}>
                      <span onClick={() => removeOrder(order._id)} style={{ color: "gray", cursor: "pointer", fontSize: "20px" }}>
                        x
                      </span>
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

  export default OrderHistory;
