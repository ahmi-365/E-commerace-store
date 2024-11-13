import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ superAdminOnly = false, children }) => {
  const storedUser = localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : null;

  // Check if the user is logged in
  if (!userData || !userData.isLoggedIn) {
    console.log("Access denied: User is not logged in.");
    return <Navigate to="/login" replace />;
  }

  // Restrict access to superadmin only if specified
  if (superAdminOnly && userData.token.role !== 'superadmin') {
    console.log("Access denied: Super admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // Allow access if all checks pass
  return children || <Outlet />;
};

export default ProtectedRoute;
