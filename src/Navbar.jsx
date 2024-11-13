import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate is used for redirect
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt, faBox, faHistory, faCogs } from '@fortawesome/free-solid-svg-icons'; // Add icons for other links
import './Navbar.css';

const AppNavbar = ({ cartCount, isLoggedIn, handleLogout, handleCartClick }) => {
  const [expanded, setExpanded] = useState(false); // State to control navbar expansion
  const navigate = useNavigate(); // For navigation on cart click

  // Retrieve the user role and permissions from the token object in localStorage
  const storedUser = localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const userRole = userData ? userData.token.role : null;
  const userPermissions = userData ? userData.token.permissions : [];

  useEffect(() => {
    // Debugging: Log the user role and permissions
    console.log('User Role from localStorage:', userRole);
    console.log('User Permissions from localStorage:', userPermissions);
  }, [userRole, userPermissions]);

  // Handle Cart click to redirect to Login if not logged in
  const handleCartRedirect = () => {
    if (isLoggedIn) {
      handleCartClick(); // Call the original cart click function if logged in
    } else {
      navigate("/login"); // Redirect to login if not logged in
    }
    setExpanded(false); // Collapse navbar after action
  };

  // Check if user has any permissions (sub-admin case)
  const hasSubAdminPermissions = userRole === 'sub-admin' && userPermissions.length > 0;

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className="shadow sticky-top full-width-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          Product Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Left side: Products (always visible) */}
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/UserProductList" onClick={() => setExpanded(false)}>
              <FontAwesomeIcon icon={faBox} className="me-2" />
              Products
            </Nav.Link>
            {/* Show Order History only if logged in */}
            {isLoggedIn && (
              <Nav.Link as={Link} to="/orderhistory" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                Order History
              </Nav.Link>
            )}
            {/* Show Admin Page if the user is admin, sub-admin with permissions, or superadmin */}
            {(userRole === 'admin' || userRole === 'superadmin' || hasSubAdminPermissions) && (
              <Nav.Link as={Link} to="/adminpage" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faCogs} className="me-2" />
                Admin Page
              </Nav.Link>
            )}
          </Nav>

          {/* Right side: Cart, Account, Logout */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Cart button always visible */}
            <Nav.Link onClick={handleCartRedirect} className="d-flex align-items-center ms-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
            </Nav.Link>
            {/* Account button always visible */}
            <Nav.Link className="d-flex align-items-center" onClick={() => setExpanded(false)}>
              <Link to="/account">
                <FontAwesomeIcon icon={faUser} className="me-1" />
              </Link>
            </Nav.Link>
            {/* Logout or Login button */}
            {isLoggedIn ? (
              <Nav.Link onClick={() => { handleLogout(); setExpanded(false); }} className="d-flex align-items-center">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                <span>Logout</span>
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faUser} className="me-1" />
                <span>Login</span>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
