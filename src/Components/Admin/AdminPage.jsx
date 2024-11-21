import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Nav, Table, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faBox, faChartLine, faHistory, faTags, faClipboardList, faTachometerAlt, faUserCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const isAdmin = true;

  const stats = [
    { title: "Total Users", value: 1200, icon: faUsers, color: "primary" },
    { title: "Total Orders", value: 350, icon: faBox, color: "success" },
    { title: "Revenue", value: "$15,000", icon: faChartLine, color: "warning" },
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLinkClick = () => {};

  return (
    <div className="admin-page">
      <Container fluid className="d-flex p-0">
        {/* Sidebar */}
        <Col
          md={2}
          className="sidebar p-4 bg-dark text-white position-fixed"
          style={{ top: 0, left: 0, height: "100vh" }}
        >
          <h4 className="mb-5 text-center">Admin Dashboard</h4>
          <Nav className="d-flex flex-column mb-4">
            <Nav.Link
              as={Link}
              to="/dashboard"
              className={`d-flex align-items-center sidebar-link ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => handleTabChange("dashboard")}
            >
              <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
              <span>Dashboard</span>
            </Nav.Link>
            {isAdmin && (
              <Nav.Link
                as={Link}
                to="/admindash"
                className="d-flex align-items-center sidebar-link"
                onClick={handleLinkClick}
              >
                <FontAwesomeIcon icon={faUserCog} className="me-2" />
                <span>Sub Admin Management</span>
              </Nav.Link>
            )}
            <Nav.Link
              as={Link}
              to="/products"
              className="d-flex align-items-center sidebar-link"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" />
              <span>Product Management</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/orderhistory"
              className="d-flex align-items-center sidebar-link"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faHistory} className="me-2" />
              <span>Order History</span>
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/coupenhistory"
              className="d-flex align-items-center sidebar-link"
              onClick={handleLinkClick}
            >
              <FontAwesomeIcon icon={faTags} className="me-2" />
              <span>Coupon History</span>
            </Nav.Link>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-5 ms-auto main-content">
          {activeTab === "dashboard" && (
            <>
              <h3 className="mb-4">Dashboard Overview</h3>
              <Row>
                {stats.map((stat, idx) => (
                  <Col md={4} key={idx}>
                    <Card className="dashboard-card mb-4 shadow-lg">
                      <Card.Body>
                        <Card.Title>{stat.title}</Card.Title>
                        <Card.Text className="fs-4">{stat.value}</Card.Text>
                        <Button
                          variant={stat.color}
                          size="sm"
                          className="w-100"
                        >
                          View Details
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* Recent Orders */}
              <Card className="shadow-lg mb-4">
                <Card.Body>
                  <h5>Recent Orders</h5>
                  <Table responsive hover>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>#1234</td>
                        <td>John Doe</td>
                        <td>Shipped</td>
                        <td>$500</td>
                      </tr>
                      <tr>
                        <td>#1235</td>
                        <td>Jane Smith</td>
                        <td>Pending</td>
                        <td>$200</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Container>
    </div>
  );
};

export default AdminPage;
