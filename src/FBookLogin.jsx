import React, { useEffect } from 'react';

function FBookLogin() {
  // Initialize the Facebook SDK once the component is mounted
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '432104696419805', // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v12.0', // Facebook Graph API version
      });
      FB.AppEvents.logPageView(); // Log page view for analytics
    };

    // Load Facebook SDK script dynamically
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Handle Facebook login
  const facebookLogin = () => {
    // Ensure FB.init has run before trying to log in
    if (window.FB) {
      FB.login(function (response) {
        if (response.authResponse) {
          console.log('Successfully logged in with Facebook');
          getUserData();
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, { scope: 'email' });
    } else {
      console.log("Facebook SDK not initialized yet.");
    }
  };

  // Fetch user data from Facebook
  const getUserData = () => {
    FB.api('/me?fields=id,name,email', function (response) {
      console.log('Facebook user data:', response);
      // Send data to your backend or handle it on the frontend
      fetch('https://e-commerace-store.onrender.com/api/users/facebook/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fbId: response.id,
          name: response.name,
          email: response.email
        }),
      })
        .then(res => res.json())
        .then(data => {
          console.log('Backend response:', data);
          // Handle the backend response (e.g., set token, save user info)
          localStorage.setItem('user', JSON.stringify(data));
          window.location.href = '/dashboard'; // Redirect to a protected route
        })
        .catch(error => console.error('Error during login:', error));
    });
  };

  return (
    <div>
      <button onClick={facebookLogin}>Login with Facebook</button>
    </div>
  );
}

export default FBookLogin;
