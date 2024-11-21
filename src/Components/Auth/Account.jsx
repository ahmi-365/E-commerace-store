import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Account = ({ isLoggedIn, handleLogin, handleLogout, userEmail }) => {
  return (
    <Row className="justify-content-center my-4">
      <Col xs={12} sm={8} md={6} lg={4}>
        <Card className="text-center shadow-sm">
          <Card.Body>
            {isLoggedIn ? (
              <>
                <FontAwesomeIcon icon={faUser} size="3x" className="mb-3" />
                <Card.Title>Welcome back, {userEmail}!</Card.Title>
                <Card.Text>
                  You are currently logged in to your account. Enjoy exploring our features.
                </Card.Text>
                <Button variant="danger" onClick={handleLogout} className="mt-2">
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faUser} size="3x" className="mb-3 text-muted" />
                <Card.Title>Guest Account</Card.Title>
                <Card.Text>
                  You're currently browsing as a guest. Log in to access more personalized features.
                </Card.Text>
                <Link to="/login">
                  <Button variant="primary" className="mt-2">
                    <FontAwesomeIcon icon={faSignInAlt} className="me-2" />
                    Login
                  </Button>
                </Link>
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Account;
