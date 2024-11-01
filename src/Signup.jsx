import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import { Link, useNavigate } from 'react-router-dom'; // Import Link for navigation and useNavigate for redirection
import './Signup.css'; // Import custom CSS for additional styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import Font Awesome
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'; // Import eye icons
import { Helmet } from 'react-helmet';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // For error messages
  const [successMessage, setSuccessMessage] = useState(''); // For success messages
  const [loading, setLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false); // For toggling password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For toggling confirm password visibility
  const navigate = useNavigate(); // Use useNavigate for redirection

  // Effect to check if passwords match
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError("Passwords do not match");
    } else {
      setError(''); // Clear the error if passwords match
    }
  }, [password, confirmPassword]);

  // Handle sign-up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSuccessMessage(''); // Reset success message before each attempt
    setLoading(true); // Set loading state to true

    // Prevent form submission if passwords do not match
    if (error) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://m-store-server-ryl5.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const { message } = await response.json(); // Get the error message from response
        throw new Error(message || 'Sign-up failed. Please try again.'); // Throw error if response is not ok
      }

      const data = await response.json(); // Read the response body only once
      setSuccessMessage(data.message); // Set success message
      setTimeout(() => navigate('/login'), 2000); // Redirect after a short delay (2 seconds)
    } catch (err) {
      setError(err.message); // Set error message to display
    } finally {
      setLoading(false); // Set loading state back to false after request completes
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignUp}>
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
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <div className="mb-3 position-relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <button
              type="button"
              className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading || error} // Disable if loading or there's an error
          >
            {loading ? 'Signing up...' : 'Sign Up'} {/* Show loading indicator */}
          </button>
          {error && <p className="text-danger text-center mt-3">{error}</p>} {/* Display error message */}
          {successMessage && <p className="text-success text-center mt-3">{successMessage}</p>} {/* Display success message */}
        </form>
        <div className="text-center">
          <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Log in here</Link></p>
        </div>
      </div>
      <Helmet>
        <title>Sign up   -ECommerace</title> {/* Set the page title */}
      </Helmet>
    </div>
  );
};

export default SignUp;
