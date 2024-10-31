import {
  Card,
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  InputGroup,
  FormControl,
  FormCheck,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Link, useNavigate } from "react-router-dom";

export default function PaymentMethods({
  cartItems,
  updateQuantity,
  removeItem,
  setOrderHistory,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponUsed, setCouponUsed] = useState(false); // Track coupon usage
  const [enableShipping, setEnableShipping] = useState(false); // Toggle shipping
  const navigate = useNavigate();

  const isLoggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.isLoggedIn;
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const calculateTotalWithoutExtras = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTotalWithExtras = () => {
    let total = calculateTotalWithoutExtras();

    // Include shipping cost only if enableShipping is true
    const validShippingCost = enableShipping ? parseFloat(shippingCost) || 0 : 0;
    total += validShippingCost;

    // Apply discount if any
    const validDiscount =
      (parseFloat(discountPercentage) || 0) > 0
        ? total * (parseFloat(discountPercentage) / 100)
        : 0;

    total -= validDiscount;

    return total;
  };

  const handleIncrease = (itemId, currentQuantity) => {
    updateQuantity(itemId, currentQuantity + 1);
  };

  const handleDecrease = (itemId, currentQuantity) => {
    if (currentQuantity > 1) {
      updateQuantity(itemId, currentQuantity - 1);
    }
  };

  const makePayment = async () => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const userEmail = user ? user.email : null;
      if (!userEmail) {
        navigate("/login");
        return;
      }

      // Increment coupon usage if the coupon is valid
      if (isCouponValid) {
        const incrementResponse = await fetch("https://m-store-server-ryl5.onrender.com/api/coupons/increment-usage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode }),
        });

        if (!incrementResponse.ok) {
          const errorData = await incrementResponse.json();
          throw new Error(errorData.error || "Failed to increment coupon usage");
        }

        const data = await incrementResponse.json();
        console.log("Coupon usage count updated:", data.usageCount);
      }

      const response = await fetch(
        "https://m-store-server-ryl5.onrender.com/api/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cartItems,
            userEmail,
            shippingCost: enableShipping ? shippingCost : 0, // Only include shipping if enabled
            discountPercentage: isCouponValid ? discountPercentage : 0,
            couponCode: isCouponValid ? couponCode : null,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create Stripe session");
      }

      const sessionData = await response.json();
      const stripe = await loadStripe(
        "pk_test_51Q8JuzAepkvGYigUYzQySvT0mpDH3tsrQ24oc2D8iskM889N6666wswvpHuEwNVW3wByAx7blim6NFCfG7AyvAQg00T8tA0hNy"
      );
      await stripe.redirectToCheckout({ sessionId: sessionData.id });

      setOrderHistory(cartItems);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateCoupon = async () => {
    setCouponError("");
    setIsCouponValid(false);

    try {
      const response = await fetch(
        "https://m-store-server-ryl5.onrender.com/api/coupons/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error validating coupon.");
      }

      const data = await response.json();
      if (data.isValid) {
        setIsCouponValid(true);
        setDiscountPercentage(data.discountPercentage);
      } else {
        setCouponError("Invalid coupon code.");
      }
    } catch (error) {
      setCouponError("Error validating coupon: " + error.message);
    }
  };

  return (
    <section className="h-100 gradient-custom">
      <Container className="py-5 h-100">
        <Row className="justify-content-center my-4">
          <Col md="8">
            {cartItems.length === 0 ? (
              <Card className="mb-4">
                <Card.Body>
                  <h5 className="text-center">Your cart is empty</h5>
                </Card.Body>
              </Card>
            ) : (
              <Card className="mb-4">
                <Card.Header className="py-3">
                  <h5 className="mb-0">
                    Cart - {cartItems.length}{" "}
                    {cartItems.length === 1 ? "item" : "items"}
                  </h5>
                </Card.Header>
                <Card.Body>
                  {cartItems.map((item) => (
                    <React.Fragment key={item._id}>
                      <Row className="align-items-center">
                        <Col lg="3" md="12" className="mb-4 mb-lg-0">
                          <div className="bg-image rounded hover-zoom hover-overlay">
                            <img
                              src={`https://m-store-server-ryl5.onrender.com/${
                                item.imageUrl || "default-image.jpg"
                              }`}
                              className="img-fluid rounded" // Changed to img-fluid
                              alt={item.name}
                            />
                          </div>
                        </Col>

                        <Col lg="5" md="6" className="mb-4 mb-lg-0">
                          <p>
                            <strong>{item.name}</strong>
                          </p>
                          <p>
                            Color:
                            <strong
                              className="ms-2"
                              style={{
                                display: "inline-block",
                                width: "25px",
                                height: "25px",
                                borderRadius: "30%",
                                backgroundColor: item.selectedColor || "none",
                              }}
                            />
                          </p>
                          <p>
                            Size: <strong>{item.selectedSize}</strong>
                          </p>
                        </Col>

                        <Col lg="4" md="6" className="mb-4 mb-lg-0">
                          <InputGroup
                            className="mb-4"
                            style={{ maxWidth: "300px", width: "100%" }} // Added width: "100%"
                          >
                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleDecrease(item._id, item.quantity)
                              }
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </Button>

                            <FormControl
                              type="number"
                              value={item.quantity}
                              min="1"
                              readOnly
                              className="text-center"
                            />

                            <Button
                              variant="outline-secondary"
                              onClick={() =>
                                handleIncrease(item._id, item.quantity)
                              }
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                          </InputGroup>
                          <Button
                            variant="danger"
                            onClick={() => removeItem(item._id)}
                          >
                            <FontAwesomeIcon icon={faTimes} /> Remove
                          </Button>
                        </Col>
                      </Row>
                      <hr />
                    </React.Fragment>
                  ))}
                  <div className="d-flex justify-content-between">
                    <h5>Total:</h5>
                    <h5>${calculateTotalWithExtras().toFixed(2)}</h5>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <FormCheck
                      type="checkbox"
                      label="Enable Shipping"
                      checked={enableShipping}
                      onChange={(e) => setEnableShipping(e.target.checked)}
                    />
                    {enableShipping && (
                      <InputGroup className="mb-3">
                        <FormControl
                          placeholder="Shipping Cost"
                          value={shippingCost}
                          onChange={(e) => setShippingCost(e.target.value)}
                        />
                      </InputGroup>
                    )}
                  </div>

                  <div className="mb-3">
                    <InputGroup>
                      <FormControl
                        placeholder="Coupon Code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button onClick={validateCoupon}>Validate</Button>
                    </InputGroup>
                    {couponError && <div className="text-danger">{couponError}</div>}
                  </div>

                  <Button
                    variant="success"
                    onClick={makePayment}
                    disabled={loading}
                    className="w-100" // Full width for button
                  >
                    {loading ? "Processing..." : "Proceed to Pay"}
                  </Button>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}
