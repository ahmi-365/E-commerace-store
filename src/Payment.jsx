import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // To get cartItems from navigate state
import { loadStripe } from '@stripe/stripe-js';

const Payment = () => {
  const location = useLocation(); // Get the cartItems from state
  const cartItems = location.state?.cartItems || []; // Ensure cartItems are passed
  
  // Calculate total amount based on cart items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const makePayment = async () => {
    try {
      const totalAmount = calculateTotal();

      const response = await fetch('https://m-store-server-ryl5.onrender.com/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cartItems }) // Send cart items to backend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create Stripe session');
      }

      const sessionData = await response.json();

      const stripe = await loadStripe('pk_test_51Q8JuzAepkvGYigUYzQySvT0mpDH3tsrQ24oc2D8iskM889N6666wswvpHuEwNVW3wByAx7blim6NFCfG7AyvAQg00T8tA0hNy'); // Use your Stripe Publishable Key
      await stripe.redirectToCheckout({ sessionId: sessionData.id });
    } catch (error) {
      console.error('Error processing payment:', error.message);
    }
  };

  return (
    <div>
      <h2>Complete Payment</h2>
      {cartItems.length > 0 ? (
        <>
          <ul>
            {cartItems.map((item, index) => (
              <li key={index}>
                {item.name} - {item.quantity} x ${item.price} = ${(item.price * item.quantity).toFixed(2)}
              </li>
            ))}
          </ul>
          <p>Total: ${calculateTotal().toFixed(2)}</p>
          <button onClick={makePayment}>Proceed to Payment</button>
        </>
      ) : (
        <p>No items in the cart.</p>
      )}
    </div>
  );
};

export default Payment;
