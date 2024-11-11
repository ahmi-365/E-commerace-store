import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ element }) => {
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

        const isSubAdmin = response.data.some((subAdmin) => subAdmin.email === user.email);
        setIsAuthorized(isSubAdmin || token === "admin-id");
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
  }, [isLoggedIn, token, user]);

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
