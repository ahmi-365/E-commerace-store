import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
      if (email === 'admin@gmail.com' && password === 'admin') {
        // Set up hardcoded admin login
        const userData = { email, isAdmin: true, userId: 'admin-id' };
        localStorage.setItem('user', JSON.stringify(userData));
        handleLogin(userData.userId, userData.email, userData.isAdmin);
        navigate('/admindash');
      } else {
        // Normal user login
        const response = await fetch('https://m-store-server-ryl5.onrender.com/api/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || 'Login failed. Please check your credentials.');
        }

        const userData = await response.json();
        localStorage.setItem('user', JSON.stringify(userData));
        handleLogin(userData.token, userData.email, userData.userId, userData.isAdmin);

        // Redirect based on admin status from the API response
        if (userData.isAdmin) {
          navigate('/admin-dashboard'); // Redirect to admin dashboard
        } else {
          navigate('/'); // Redirect to home for regular users
        }
      }
    } catch (err) {
      setError(err.message);
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
