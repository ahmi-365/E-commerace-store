import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Col, Row, Container, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';

const OrderDetails = () => {
    const { orderId } = useParams(); // Get orderId from the URL parameters
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (orderId) {
                try {
                    const response = await axios.get(`https://m-store-server-ryl5.onrender.com/api/orders/${orderId}`);
                    console.log('Order details fetched:', response.data); // Debugging log
                    setOrderDetails(response.data); // Ensure the correct data is assigned
                } catch (error) {
                    console.error('Error fetching order details:', error);
                    setError('Failed to fetch order details. Please try again.');
                }
            } else {
                setError('Order ID is not defined');
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    if (error) {
        return <Alert variant="danger" className="text-center">{error}</Alert>;
    }

    if (!orderDetails) {
        return <div className="text-center my-5">Loading order details...</div>;
    }

    // Use optional chaining (?.) to prevent crashes when accessing potentially undefined properties
    const { _id, totalAmount, shippingCost, discountPercentage, createdAt } = orderDetails?.order || {};
    const items = orderDetails?.items || []; // Safely access items array

    if (!_id) {
        return <Alert variant="danger" className="text-center">Order details could not be retrieved.</Alert>;
    }

    return (
        <Container className="order-details-container my-5">
            <h2 className="text-center mb-4">Order Details</h2>
            <div className="order-summary bg-light p-4 rounded mb-5">
                <h4 className="text-secondary mb-3">Order ID: <Badge bg="secondary">{_id}</Badge></h4>
                <p className="mb-1"><strong>Total Amount:</strong> <span className="text-success">${totalAmount?.toFixed(2)}</span></p>
                <p className="mb-1"><strong>Shipping Cost:</strong> <span className="text-success">${shippingCost?.toFixed(2)}</span></p> 
                <p className="mb-1"><strong>Discount:</strong> <span className="text-success">{discountPercentage}%</span></p> 
                <p className="mb-0"><strong>Order Date:</strong> {new Date(createdAt).toLocaleDateString()}</p>
            </div>

            <Row>
                {items.length > 0 ? items.map((item, index) => (
                    <Col key={index} md={6} lg={4} className="mb-4">
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Img 
                                variant="top" 
                                src={`http://localhost:5000/${item.imageUrl}`} 
                                alt={item.name}
                                className="rounded-top"
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title className="text-primary">{item.name}</Card.Title>
                                <Card.Text className="flex-grow-1">
                                    <strong>Brand:</strong> {item.brand}<br />
                                    <strong>Category:</strong> {item.category}<br />
                                    <strong>SKU:</strong> {item.sku}<br />
                                    <strong>Price:</strong> <span className="text-success">${item.price?.toFixed(2)}</span><br />
                                    <strong>Quantity:</strong> {item.quantity}<br />
                                    <strong>Size:</strong> {item.selectedSize || 'N/A'}<br />
                                    <strong>Color:</strong> 
                                    <span 
                                        style={{ 
                                            backgroundColor: item.selectedColor || '#ccc', 
                                            display: 'inline-block',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            marginLeft: '5px',
                                            verticalAlign: 'middle',
                                            border: '1px solid #ccc' 
                                        }}
                                    />
                                </Card.Text>
                                <Card.Footer className="bg-white">
                                    <strong>Description:</strong> {item.description}
                                </Card.Footer>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : (
                    <p className="text-center">No items found for this order.</p>
                )}
            </Row>
        </Container>
    );
};

export default OrderDetails;
