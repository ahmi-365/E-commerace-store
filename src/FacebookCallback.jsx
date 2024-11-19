import React, { useEffect } from 'react';

function FacebookCallback() {
  const fetchFacebookData = async () => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    
    console.log("Authorization code:", code);  // Make sure 'code' is being logged here

    if (!code) {
      console.error('No authorization code found');
      return;
    }

    try {
      const response = await fetch(
        `https://m-store-server-ryl5.onrender.com/api/users/facebook/callback?code=${code}`,
        { method: 'GET' }
      );
      const data = await response.json();
      console.log("API Response:", data);  // Check the API response here

      if (response.ok) {
        console.log('Login Successful:', data); // Make sure data is logged correctly
        // Store user data and redirect
      } else {
        console.error('Facebook login error:', data.message);
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

  useEffect(() => {
    fetchFacebookData();
  }, []);

  return <div>Logging you in via Facebook...</div>;
}

export default FacebookCallback;
