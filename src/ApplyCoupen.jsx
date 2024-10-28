import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, InputGroup, FormControl, Alert } from 'react-bootstrap';

const ApplyCoupon = ({ onApplyCoupon }) => {
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponDetails, setCouponDetails] = useState(null); // Track coupon details

  const handleApplyCoupon = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/coupons/validate', { code: couponCode });

      // Check if the response contains the expected properties
      if (response.data) {
        const { isValid, discountPercentage, usageCount, usageLimit, expiryDate } = response.data;

        if (isValid) {
          setSuccess(`Coupon applied! You get ${discountPercentage}% off.`);
          setDiscount(discountPercentage);
          setError('');
          
          // Store coupon details for displaying
          setCouponDetails({
            usageCount,
            usageLimit,
            expiryDate,
          });

          onApplyCoupon(discountPercentage); // Pass the discount to the parent component
        } else {
          setError('Invalid or expired coupon code.');
          resetCouponState();
        }
      } else {
        setError('Invalid response from the server.');
        resetCouponState();
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setError('Failed to validate coupon. Please try again later.');
      resetCouponState();
    }
  };

  const resetCouponState = () => {
    setDiscount(0);
    setCouponDetails(null); // Reset coupon details
  };

  return (
    <div>
      <h3>Apply Coupon</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />
        <Button variant="outline-secondary" onClick={handleApplyCoupon}>
          Apply
        </Button>
      </InputGroup>
      {discount > 0 && couponDetails && (
        <div>
          <p>Discount Applied: {discount}%</p>
          <p>Usage Count: {couponDetails.usageCount} of {couponDetails.usageLimit}</p>
          <p>Expiry Date: {couponDetails.expiryDate && new Date(couponDetails.expiryDate).toLocaleDateString()}</p> {/* Format expiry date */}
        </div>
      )}
    </div>
  );
};

export default ApplyCoupon;
