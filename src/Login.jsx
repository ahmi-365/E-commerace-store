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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if the credentials match the hardcoded super admin credentials
      if (email === 'admin@gmail.com' && password === 'admin') {
        const userData = { email, isAdmin: true, userId: 'admin-id' };
        localStorage.setItem('user', JSON.stringify(userData));
        handleLogin(userData.userId, userData.email, userData.isAdmin);
        navigate('/');
        return;
      } 

      // Attempt to log in as an admin
      try {
        const adminResponse = await axios.post(
          'https://m-store-server-ryl5.onrender.com/api/admin/login',
          { email, password },
          { withCredentials: true }
        );

        if (adminResponse.status === 200) {
          const adminData = adminResponse.data;
          adminData.isAdmin = true;
          localStorage.setItem('user', JSON.stringify(adminData));
          handleLogin(adminData.userId, adminData.email, adminData.isAdmin);
          navigate('/admindash');
          return;  // Exit if admin login is successful
        }
      } catch (adminError) {
        // Handle admin login failure but continue to user login
        console.warn("Admin login failed, attempting user login.");
        // Optionally you can log the error
        console.error("Admin login error:", adminError);
      }

      // Now attempt to log in as a regular user
      const userResponse = await axios.post(
        'https://m-store-server-ryl5.onrender.com/api/users/login',
        { email, password },
        { withCredentials: true }
      );

      const userData = userResponse.data;
      userData.isAdmin = false;
      localStorage.setItem('user', JSON.stringify(userData));
      handleLogin(userData.userId, userData.email, userData.isAdmin);
      navigate('/');

    } catch (userError) {
      console.error("User login error:", userError);
      setError(userError.response?.data?.message || 'Login failed. Please check your credentials.');
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
