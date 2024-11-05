// PaymentDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

const PaymentDetails = () => {
  const { id } = useParams(); // Get the order ID from the URL
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        const response = await axios.get(`https://m-store-server-ryl5.onrender.com/api/payments/${id}`);
        setPayment(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
        toast.error("Failed to fetch payment details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!payment) {
    return <Typography>No payment details found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h4">Payment Details</Typography>
      <Typography variant="h6">Payment ID: {payment.paymentId}</Typography>
      <Typography variant="body1">Order ID: {payment.orderId}</Typography>
      <Typography variant="body1">Amount: ${payment.amount.toFixed(2)}</Typography>
      <Typography variant="body1">Currency: {payment.currency}</Typography>
      <Typography variant="body1">Status: <strong>{payment.paymentStatus}</strong></Typography>
      <Typography variant="body1">Payment Method: {payment.paymentMethod}</Typography>
      <Typography variant="body1">Receipt URL: <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">View Receipt</a></Typography>
      <Button variant="contained" color="primary" onClick={() => window.history.back()}>
        Back to Orders
      </Button>
      <ToastContainer />
    </div>
  );
};

export default PaymentDetails;
