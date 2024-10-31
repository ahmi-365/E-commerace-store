import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import './Coupon.css'; // Optional: Create a CSS file for additional custom styles

export default function Coupon() {
  // Define the state for the coupon fields
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  // Handle form submission to create the coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError("");
    setSuccess("");

    // Validation check
    if (discount <= 0 || limit <= 0) {
      setError("Discount and Usage Limit must be greater than zero.");
      return;
    }

    try {
      // Send a POST request to the backend to create a new coupon
      const response = await axios.post("https://m-store-server-ryl5.onrender.com/api/coupons", {
        code: couponCode,
        discountPercentage: discount,
        expiryDate: expiry,
        usageLimit: limit,
      });

      setSuccess("Coupon created successfully!");
      
      // Clear form fields
      setCouponCode("");
      setDiscount("");
      setExpiry("");
      setLimit("");

      console.log("Coupon created:", response.data);
      
      // Navigate to the coupon history page after successful creation
      navigate("/coupenhistory");
      
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        setError("Error creating coupon: " + error.response.data.error);
      } else if (error.request) {
        setError("Error creating coupon: No response from server");
      } else {
        setError("Error creating coupon: " + error.message);
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '400px', padding: '20px' }}>
        <h3 className="text-center mb-4">Create a New Coupon</h3>

        <Form onSubmit={handleCreateCoupon}>
          {/* Input for Coupon Code */}
          <Form.Group controlId="couponCode">
            <Form.Label>Coupon Code</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              required
            />
          </Form.Group>

          {/* Input for Discount */}
          <Form.Group controlId="discountPercentage">
            <Form.Label>Discount Percentage</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter discount percentage"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
          </Form.Group>

          {/* Input for Expiry Date */}
          <Form.Group controlId="expiryDate">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
          </Form.Group>

          {/* Input for Usage Limit */}
          <Form.Group controlId="usageLimit">
            <Form.Label>Usage Limit</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter usage limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </Form.Group>

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 mt-2">
            Create Coupon
          </Button>
        </Form>

        {/* Display error or success message */}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {success && (
          <Alert variant="success" className="mt-3">{success}</Alert>
        )}
      </Card>
    </div>
  );
}
