import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element, requiredPermission }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = user && user.isLoggedIn;
  const token = user ? user.token : null;

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!token) {
        setIsAuthorized(false);
        return;
      }

      try {
        const response = await axios.get(
          'https://m-store-server-ryl5.onrender.com/api/admin/subadmins',
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Assuming response.data contains a list of subadmins
        const isSubAdmin = response.data.some((subAdmin) => subAdmin.email === user.email);
        
        // Check if the user is either an admin or has the required permission (sub-admin in this case)
        setIsAuthorized(isSubAdmin || token.id === "admin-id" || requiredPermission === "public");
      } catch (error) {
        console.error("Authorization check failed:", error);
        setIsAuthorized(false);
      }
    };

    if (isLoggedIn) {
      checkAuthorization();
    } else {
      setIsAuthorized(false);
    }
  }, [isLoggedIn, token, user, requiredPermission]);

  // Show loading while checking authorization
  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  // Redirect to home if not authorized
  if (!isAuthorized) {
    return <Navigate to="/" />;
  }

  // If authorized, render the element
  return element;
};

export default ProtectedRoute;
