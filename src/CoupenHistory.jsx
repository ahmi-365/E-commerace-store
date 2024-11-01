import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Alert, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './CouponHistory.css';
import { Helmet } from 'react-helmet';

const CouponHistory = () => {
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get('https://m-store-server-ryl5.onrender.com/api/coupons');
        setCoupons(response.data);
      } catch (err) {
        setError('Failed to fetch coupons. Please try again later.');
        console.error('Error fetching coupons:', err);
      }
    };

    fetchCoupons();
  }, []);

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const isUsageLimitExceeded = (usageCount, usageLimit) => {
    return usageCount >= usageLimit;
  };

  const adjustDate = (date) => {
    const adjustedDate = new Date(date);
    adjustedDate.setDate(adjustedDate.getDate() + 1); // Adding one day to the expiry date
    return adjustedDate;
  };

  return (
    <Container className="coupon-history-container mt-5">
      <h2 className="text-center mb-4">Coupon History</h2>
      <Helmet>
        <title>Coupen History -ECommerace</title> {/* Set the page title */}
      </Helmet>
      {error && <Alert variant="danger" className="alert-custom">{error}</Alert>}
      {coupons.length > 0 ? (
        <Table responsive className="table-custom">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Discount (%)</th>
              <th>Usage Count</th>
              <th>Usage Limit</th>
              <th>Expiry Date</th>
              <th>Expired</th>
              <th>Usage Limit Exceeded</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon._id}>
                <td>{coupon.code}</td>
                <td>{coupon.discountPercentage}%</td>
                <td>{coupon.usageCount}</td>
                <td>{coupon.usageLimit}</td>
                <td>{adjustDate(coupon.expiryDate).toLocaleDateString()}</td> {/* Adjusted date */}
                <td>
                  <span className={isExpired(coupon.expiryDate) ? 'text-danger' : 'text-success'}>
                    {isExpired(coupon.expiryDate) ? 'Expired' : 'Valid'}
                  </span>
                </td>
                <td>
                  <span className={isUsageLimitExceeded(coupon.usageCount, coupon.usageLimit) ? 'text-danger' : 'text-success'}>
                    {isUsageLimitExceeded(coupon.usageCount, coupon.usageLimit) ? 'Limit Reached' : 'Available'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center no-coupons-message">No coupons available.</p>
      )}

      {/* Floating Button */}
      <Link to="/coupen" style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button variant="success" size="lg" className="rounded-circle">
          +
        </Button>
      </Link>
    </Container>
  );
};

export default CouponHistory;
