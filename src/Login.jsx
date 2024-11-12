import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLoginRedirect = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    handleLogin(userData);
    if (userData.permissions.includes('allPermissions')) {
      navigate('/admindash'); 
    } else if (userData.permissions.includes('manageProducts')) {
      navigate('/products');
    } else if (userData.permissions.includes('viewOrders')) {
      navigate('/orderhistory');
    } else if (userData.permissions.includes('manageUsers')) {
      navigate('/usermanage');
    } else if (userData.role === 'superadmin') {
      navigate('/admindash');
    } else {
      navigate('/'); // Default to home page if no specific permissions
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear any previous user data
    localStorage.removeItem('user');

    try {
      // Super Admin Login
      if (email === 'admin@gmail.com' && password === 'admin') {
        const superAdminData = {
          isLoggedIn: true,
          email: 'admin@gmail.com',
          role: 'superadmin',
          id: 'admin-id',
          permissions: ['allPermissions'], // Adjust permissions as needed
          isAdmin: true,
        };
        handleLoginRedirect(superAdminData);
        return;
      }

      // Admin/Sub-admin Login
      const response = await axios.post(
        'https://m-store-server-ryl5.onrender.com/api/admin/login',
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { role, token, userId, permissions } = response.data;
        
        // Check if user has 'allPermissions' and treat as superadmin
        if (permissions.includes('allPermissions')) {
          const superAdminData = {
            isLoggedIn: true,
            token,
            email,
            id: userId,
            role: 'superadmin',
            permissions,
            isAdmin: true, // Mark as admin for superadmin
          };
          handleLoginRedirect(superAdminData);
          return;
        }

        const adminData = {
          isLoggedIn: true,
          token,
          email,
          id: userId,
          role,
          permissions,
          isAdmin: role === 'admin' || role === 'subadmin',
        };
        handleLoginRedirect(adminData);
        return;
      }
      
      // Regular User Login
      const userResponse = await axios.post(
        'https://m-store-server-ryl5.onrender.com/api/users/login',
        { email, password },
        { withCredentials: true }
      );

      const { token, userId } = userResponse.data;
      const userData = {
        isLoggedIn: true,
        token,
        email,
        id: userId,
        role: 'user',
        permissions: [],
        isAdmin: false,
      };
      handleLoginRedirect(userData);
    } catch (loginError) {
      console.error('Login error:', loginError);
      setError(
        loginError.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <Helmet>
        <title>Login - ECommerce</title>
      </Helmet>
      <div className="card shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button
              type="button"
              className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className="text-danger text-center mt-3">{error}</p>}
        </form>
        <div className="text-center">
          <p className="mb-0">
            New user? <Link to="/signup" className="text-primary">Sign up here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
