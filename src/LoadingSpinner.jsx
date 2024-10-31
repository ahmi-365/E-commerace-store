// LoadingSpinner.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ message = 'Loading...' }) => (
  <div className="text-center my-5">
    <Spinner animation="border" role="status" />
    <span className="ms-2">{message}</span>
  </div>
);

export default LoadingSpinner;
