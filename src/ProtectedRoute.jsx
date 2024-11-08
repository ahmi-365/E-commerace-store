import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user && user.isLoggedIn;
  const token = user ? user.token : null;
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  if (token === "admin-id") {
    return element;
  }
  return <Navigate to="/" />;
};

export default ProtectedRoute;
