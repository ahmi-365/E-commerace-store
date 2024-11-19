import React from 'react';

function FBookLogin() {
  const handleFacebookLogin = () => {
    const appId = '432104696419805'; // Your Facebook App ID
    const redirectUri = 'https://e-commerace-store.onrender.com/api/users/facebook/callback'; // Ensure this matches the backend

    // Facebook OAuth URL
    const fbLoginUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=email,public_profile`;

    // Redirect user to Facebook login page
    window.location.href = fbLoginUrl;
  };

  return (
    <button onClick={handleFacebookLogin}>
      Login with Facebook
    </button>
  );
}

export default FBookLogin;
