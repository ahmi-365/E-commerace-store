import React, { useState } from 'react';
import { MDBContainer, MDBInput, MDBBtn, MDBCheckbox } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Signup.css'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    axios.post('http://localhost:5000/api/users/signup', { email, password })
      .then(response => {
        setMessage(response.data.message);  // Display success message
        navigate('/login');  // Redirect to login page after successful sign-up
      })
      .catch(error => {
        setMessage(error.response?.data.message || 'An error occurred during sign-up');
      });
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      <h2 className="text-center">Sign Up</h2>
      {message && <p className={message.includes("success") ? "text-success" : "text-danger"}>{message}</p>}
      <form onSubmit={handleSignUp}>
        <MDBInput
          wrapperClass='mb-4'
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass='mb-4'
          label='Password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <MDBInput
          wrapperClass='mb-4'
          label='Confirm Password'
          type='password'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <div className="d-flex justify-content-between mx-4 mb-4">
          <MDBCheckbox name='flexCheck' id='flexCheckDefault' label='Remember me' />
        </div>

        <Button className="mb-4 w-100" type="submit">Sign up</Button>
      </form>

      <div className="text-center">
        <p className="mb-0">Already have an account? <Link to="/login" className="text-primary">Log in</Link></p>
      </div>
    </MDBContainer>
  );
};

export default SignUp;
