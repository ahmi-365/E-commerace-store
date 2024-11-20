import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function FBookLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: '432104696419805',
        cookie: true,
        xfbml: true,
        version: 'v12.0',
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }, []);

  const saveUserData = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    window.dispatchEvent(new Event('storage')); // Trigger re-render for AppNavbar
  };

  const facebookLogin = () => {
    FB.login(
      function (response) {
        if (response.authResponse) {
          FB.api('/me', { fields: 'id,name,email' }, function (userInfo) {
            const userData = {
              isLoggedIn: true,
              token: {
                email: userInfo.email,
                id: userInfo.id,
                name: userInfo.name,
                isAdmin: false,
                permissions: [],
                role: 'user',
                token: '', // Replace with the actual token
              },
            };
            saveUserData(userData);
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
      <button onClick={facebookLogin}>Login with Facebook</button>
    </div>
  );
}

export default FBookLogin;
