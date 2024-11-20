import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt, faBox, faHistory, faCogs, faCog } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const AppNavbar = ({ cartCount, handleCartClick }) => {
  const [expanded, setExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userPermissions, setUserPermissions] = useState([]);
  const navigate = useNavigate();

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    const userData = storedUser ? JSON.parse(storedUser) : null;
    setIsLoggedIn(userData?.isLoggedIn || false);
    setUserRole(userData?.token.role || null);
    setUserPermissions(userData?.token.permissions || []);
  };

  useEffect(() => {
    loadUserData();

    // Listen to changes in localStorage
    const handleStorageChange = () => {
      loadUserData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleCartRedirect = () => {
    if (isLoggedIn) {
      handleCartClick();
    } else {
      navigate('/login');
    }
    setExpanded(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserPermissions([]);
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded} className="shadow sticky-top full-width-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          Product Management
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={() => setExpanded(!expanded)} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/UserProductList" onClick={() => setExpanded(false)}>
              <FontAwesomeIcon icon={faBox} className="me-2" />
              Products
            </Nav.Link>
            {isLoggedIn && (
              <Nav.Link as={Link} to="/Order-history" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faHistory} className="me-2" />
                View Orders
              </Nav.Link>
            )}
            {userPermissions.includes('manageProducts') && (
              <Nav.Link as={Link} to="/products" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faBox} className="me-2" />
                Manage Products
              </Nav.Link>
            )}
            {userPermissions.includes('viewOrders') && (
              <Nav.Link as={Link} to="/orderhistory" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faCog} className="me-2" />
                Manage Order History
              </Nav.Link>
            )}
            {userPermissions.includes('manageUsers') && (
              <Nav.Link as={Link} to="/usermanage" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faCogs} className="me-2" />
                Manage Users
              </Nav.Link>
            )}
            {userRole === 'superadmin' && (
              <Nav.Link as={Link} to="/adminpage" onClick={() => setExpanded(false)}>
                <FontAwesomeIcon icon={faCogs} className="me-2" />
                Admin Page
              </Nav.Link>
            )}
          </Nav>
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link onClick={handleCartRedirect} className="d-flex align-items-center ms-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-1" />
              {cartCount > 0 && <span className="badge bg-danger ms-1">{cartCount}</span>}
            </Nav.Link>
            {isLoggedIn ? (
              <Nav.Link onClick={handleLogout} className="d-flex align-items-center">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-1" />
                Logout
              </Nav.Link>
            ) : (
              <Nav.Link as={Link} to="/login" className="d-flex align-items-center">
                <FontAwesomeIcon icon={faUser} className="me-1" />
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
