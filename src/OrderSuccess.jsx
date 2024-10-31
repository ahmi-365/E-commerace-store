// src/components/OrderSuccess.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import './OrderSuccess.css'; // Optional custom CSS

const OrderSuccess = () => {
    const location = useLocation();
    const { cartItems = [], totalAmount = 0 } = location.state || {}; // Default to empty array and 0

    return (
        <Container className="order-success-container">
            <h1>Order Successfully Placed</h1>
            {cartItems.length > 0 ? (
                <div>
                    <h2>Purchased Items:</h2>
                    <Row>
                        {cartItems.map((item, index) => (
                            <Col key={index} md={4} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={`https://m-store-server-ryl5.onrender.com/${item.imageUrl}`} alt={item.name} />
                                    <Card.Body>
                                        <Card.Title>{item.name}</Card.Title>
                                        <Card.Text>
                                            Price: ${item.price} x {item.quantity}
                                        </Card.Text>
                                        <Card.Text className="font-weight-bold">
                                            Total: ${(item.price * item.quantity).toFixed(2)}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <h3 className="mt-4">Total Amount: ${totalAmount.toFixed(2)}</h3>
                </div>
            ) : (
                <p></p>
            )}
        </Container>
    );
};

export default OrderSuccess;
