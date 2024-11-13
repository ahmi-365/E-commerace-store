import React from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import './Home.css'; // Assuming you have custom styles

// Import local images
import product1 from './assets/images/product1.jpg';
import product2 from './assets/images/product2.jpg';
import product3 from './assets/images/product3.jpg';
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <div className="home-page">
      <Helmet>
        <title>Home -ECommerace</title> {/* Set the page title */}
      </Helmet>
      {/* Hero Section */}
      <div className="hero-section text-center text-white">
        <Container>
          <h1>Welcome to E-Commerce</h1>
          <p>Your one-stop solution for interactive apps and websites</p>
          <Button variant="primary" as={Link} to="/UserProductList" className="m-2">Shop Now</Button>
          <Button variant="outline-light" className="m-2">Learn More</Button>
        </Container>
      </div>

      {/* Product Highlights Section */}
      <Container className="mt-5">
        <h2 className="text-center mb-4">Popular Products</h2>
        <Row>
          {/* Product 1 */}
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Img 
                variant="top" 
                src={product1} 
                alt="Product 1" 
              />
              <Card.Body>
                <Card.Text>Explore the best features of this product.</Card.Text>
                <Button variant="primary" as={Link} to="/UserProductList">View Product</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Product 2 */}
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Img 
                variant="top" 
                src={product2} 
                alt="Product 2" 
              />
              <Card.Body>
                <Card.Text>Check out the premium features here.</Card.Text>
                <Button variant="primary" as={Link} to="/UserProductList">View Product</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Product 3 */}
          <Col md={4}>
            <Card className="mb-4 shadow-sm">
              <Card.Img 
                variant="top" 
                src={product3} 
                alt="Product 3" 
              />
              <Card.Body>
                <Card.Text>Find out more about this top product.</Card.Text>
                <Button variant="primary" as={Link} to="/UserProductList">View Product</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <div className="features-section text-center text-white py-5">
        <Container>
          <h2>Why Choose Us?</h2>
          <Row className="mt-4">
            <Col md={4}>
              <div className="feature-box">
                <i className="fas fa-cog fa-3x mb-3"></i>
                <h5>Custom Solutions</h5>
                <p>Tailored solutions for your business needs.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-box">
                <i className="fas fa-rocket fa-3x mb-3"></i>
                <h5>Fast Performance</h5>
                <p>Optimized for speed and performance.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="feature-box">
                <i className="fas fa-lock fa-3x mb-3"></i>
                <h5>Secure & Reliable</h5>
                <p>Top-notch security to protect your data.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Footer Section */}
      <footer className="footer-section text-center text-white py-4">
        <Container>
          <p>&copy; 2024 Magestic Soft. All rights reserved.</p>
          <div>
            <Link to="/privacy" className="text-white me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-white">Terms of Service</Link>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default Home;
