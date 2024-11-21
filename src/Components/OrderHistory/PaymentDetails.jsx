import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, CircularProgress, Paper, Grid } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PaymentDetails = () => {
  const { id } = useParams(); // Get the payment ID from the URL
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
    return <CircularProgress style={{ display: 'block', margin: 'auto', marginTop: '20%' }} />;
  }

  if (!payment) {
    return <Typography variant="h6" align="center">No payment details found.</Typography>;
  }

  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h4" align="center" gutterBottom>Payment Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Payment ID:</Typography>
          <Typography variant="body1" style={{ wordWrap: 'break-word', maxWidth: '300px' }}>
            {payment.paymentId}
          </Typography> {/* Display Payment ID with wrapping */}
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Order ID:</Typography>
          <Typography variant="body1">{payment.orderId}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Amount:</Typography>
          <Typography variant="body1">${payment.amount.toFixed(2)}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Currency:</Typography>
          <Typography variant="body1">{payment.currency}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Status:</Typography>
          <Typography variant="body1" style={{ fontWeight: 'bold', color: payment.paymentStatus === 'Paid' ? 'green' : 'green' }}>
            {payment.paymentStatus}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Payment Method:</Typography>
          <Typography variant="body1">{payment.paymentMethod}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Receipt URL:</Typography>
          <Typography variant="body1">
            <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer">
              View Receipt
            </a>
          </Typography>
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" onClick={() => window.history.back()} style={{ marginTop: '20px' }}>
        Back to Orders
      </Button>
      <ToastContainer />
    </Paper>
  );
};

export default PaymentDetails;
