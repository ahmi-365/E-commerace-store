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
  if (superAdminOnly && userData.token.role !== 'superadmin') {
    console.log("Access denied: Super admin privileges required.");
    return <Navigate to="/" replace />;
  }
  
  // Check if the user is a super admin, allowing access to everything
  if (userData.token.role === 'superadmin') {
    console.log("Access granted: Super admin privileges override.");
    return <Outlet />;
  }
  

  // Check if superAdminOnly access is required and user is not a superadmin
  if (superAdminOnly) {
    console.log("Access denied: Super admin privileges required.");
    return <Navigate to="/" replace />;
  }

  // For non-superadmin users, check if specific permissions are required
  if (requiredPermissions.length > 0) {
    const userPermissions = userData.token.permissions || [];
    console.log("User Permissions:", userPermissions);
    console.log("Required Permissions:", requiredPermissions);

    // Check if user has at least one of the required permissions
    const hasPermission = requiredPermissions.some((perm) => userPermissions.includes(perm));

    if (!hasPermission) {
      console.log("Access denied: insufficient permissions.");
      return <Navigate to="/" replace />;
    }
  }

  // Render the protected content if all checks pass
  return <Outlet />;
};

export default ProtectedRoute;
