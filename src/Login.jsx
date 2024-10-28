import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for redirection
import './Login.css'; // Import custom CSS for additional styling

const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Use useNavigate for redirection

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error state before each attempt
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json(); // Get the error message from response
        throw new Error(message || 'Login failed. Please check your credentials.'); // Throw error if response is not ok
      }

      const userData = await response.json(); // Read the response body only once

      localStorage.setItem('user', JSON.stringify(userData));
      handleLogin(userData.token, userData.email, userData.userId);

      navigate('/'); // Redirect after successful login (adjust the route as necessary)
    } catch (err) {
      setError(err.message); // Set error message to display
    } finally {
      setLoading(false); // Set loading state back to false after request completes
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow p-4" style={{ width: '400px' }}>
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
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'} {/* Show loading indicator */}
          </button>
          {error && <p className="text-danger text-center mt-3">{error}</p>} {/* Display error message */}
        </form>
        <div className="text-center">
          <p className="mb-0">New user? <Link to="/signup" className="text-primary">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
