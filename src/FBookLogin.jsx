import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FBookLogin() {
  const navigate = useNavigate();
  const [isSdkLoaded, setIsSdkLoaded] = useState(false); // Track SDK load status

  // Initialize the Facebook SDK once the component is mounted
  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '432104696419805', // Replace with your Facebook App ID
        cookie: true,
        xfbml: true,
        version: 'v12.0',
      });
      FB.AppEvents.logPageView();
      setIsSdkLoaded(true); // Mark SDK as loaded
    };

    // Dynamically load Facebook SDK script
    (function (d, s, id) {
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      const fjs = d.getElementsByTagName(s)[0];
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  // Save user data in localStorage
  const saveUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('User data saved:', userData);
  };

  // Handle Facebook login
  const facebookLogin = () => {
    if (!isSdkLoaded) {
      console.error('Facebook SDK is not loaded yet.');
      return;
    }

    FB.login(
      (response) => {
        if (response.authResponse) {
          // Fetch Facebook user details
          FB.api('/me', { fields: 'id,name,email' }, (userInfo) => {
            console.log('Facebook user data:', userInfo);

            // Structure the Facebook user data
            const userData = {
              isLoggedIn: true,
              token: {
                isLoggedIn: true,
                email: userInfo.email,
                id: userInfo.id,
                name: userInfo.name,
                isAdmin: false,
                permissions: [],
                role: 'user',
                token: 'your_jwt_token_here', // Replace with actual token
              },
            };

            // Save the user data in localStorage
            saveUserData(userData);

            // Redirect to the home page
            navigate('/');
          });
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      },
      { scope: 'email' }
    );
  };

  return (
    <div>
      <button onClick={facebookLogin} disabled={!isSdkLoaded}>
        {isSdkLoaded ? 'Login with Facebook' : 'Loading Facebook SDK...'}
      </button>
    </div>
  );
}

export default FBookLogin;
