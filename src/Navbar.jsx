import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUser, faSignOutAlt, faBox, faHistory, faCogs, faCog } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const AppNavbar = ({ cartCount, isLoggedIn, handleLogout, handleCartClick }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('user');
  const userData = storedUser ? JSON.parse(storedUser) : null;
  const userRole = userData ? userData.token.role : null;
  const userPermissions = userData ? userData.token.permissions : [];

  useEffect(() => {
   
  }, [userRole, userPermissions]);

  const handleCartRedirect = () => {
    if (isLoggedIn) {
      handleCartClick();
    } else {
      navigate("/login");
    }
    setExpanded(false);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)} className="shadow sticky-top full-width-navbar">
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
            <Nav.Link className="d-flex align-items-center" onClick={() => setExpanded(false)}>
              <Link to="/account">
                <FontAwesomeIcon icon={faUser} className="me-1" />
              </Link>
            </Nav.Link>
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
