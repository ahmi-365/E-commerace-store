import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faHistory, faUser, faSignOutAlt, faTags } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const AppNavbar = ({ cartCount, isLoggedIn, userEmail, handleLogout, handleCartClick }) => {
  const [expanded, setExpanded] = useState(false); // State to control navbar expansion
  const location = useLocation(); // Get the current location

  // Function to handle link click and close navbar
  const handleLinkClick = () => setExpanded(false);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className="shadow sticky-top full-width-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={handleLinkClick}>
          Product Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/products" onClick={handleLinkClick}>Products</Nav.Link>
          </Nav>
          <Nav className="ml-auto d-flex align-items-center mobile-nav">
            <Nav.Link as={Link} to="/orderhistory" className="d-flex align-items-center" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faHistory} className="me-1" />
              <span>Order History</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/coupenhistory" className="d-flex align-items-center ms-3" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faTags} className="me-1" />
              <span>Coupon History</span>
            </Nav.Link>
            <Nav.Link onClick={() => { handleCartClick(); handleLinkClick(); }} className="d-flex align-items-center ms-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
            </Nav.Link>
            {isLoggedIn ? (
              <>
                <Nav.Link className="d-flex align-items-center" onClick={handleLinkClick}>
                  <Link to="/account">
                    <FontAwesomeIcon icon={faUser} className="me-1" />
                  </Link>
                </Nav.Link>
                <Nav.Link onClick={() => { handleLogout(); handleLinkClick(); }} className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                  <span>Logout</span>
                </Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center" onClick={handleLinkClick}>
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
