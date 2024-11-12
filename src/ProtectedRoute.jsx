import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ requiredPermissions = [], superAdminOnly = false }) => {
  // Retrieve user data from localStorage
  const storedUser = localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : null;

  // Check if user is logged in
  if (!userData || !userData.isLoggedIn) {
    console.log("Access denied: User is not logged in.");
    return <Navigate to="/login" replace />;
  }

  // Check if super admin access is required and if the user is a super admin
  if (superAdminOnly && userData.token.role !== 'superadmin') {
    console.log("Access denied: Super admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // Get user permissions from token and check required permissions
  const userPermissions = userData.token.permissions || [];
  console.log("User Permissions:", userPermissions);
  console.log("Required Permissions:", requiredPermissions);

  const hasPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm) => userPermissions.includes(perm));

  if (!hasPermission) {
    console.log("Access denied: insufficient permissions.");
    return <Navigate to="/" replace />;
  }

  // Render the protected content if all checks pass
  return <Outlet />;
};

export default ProtectedRoute;

