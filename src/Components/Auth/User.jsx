import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

const OrderButton = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start the animation immediately when the component mounts
    setAnimate(true);

    // Stop the animation after 10 seconds
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 10000); // reset animation after 10 seconds

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <Button
      className={`order ${animate ? 'animate' : ''}`}
    >
      <span className="success">
        
      </span>
      <div className="box"></div>
      <div className="truck">
        <div className="back"></div>
        <div className="front">
          <div className="window"></div>
        </div>
        <div className="light top"></div>
        <div className="light bottom"></div>
      </div>
      <div className="lines"></div>
    </Button>
  );
};

function User() {
  return (
    <div className="App">
      <OrderButton />
    </div>
  );
}

export default User;
