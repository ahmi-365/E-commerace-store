import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FacebookCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
   const urlParams = new URLSearchParams(window.location.search);
   const code = urlParams.get('code');

   if (code) {
       // Send the code to the backend to exchange for an access token
       fetch(`https://m-store-server-ryl5.onrender.com/api/users/facebook/callback?code=${code}`, {
           method: 'GET',
       })
       .then(response => response.json())
       .then(data => {
           // Handle the response from backend, store the user info or token
           console.log('Facebook login successful:', data);
           // Redirect or perform any action after login success
           window.location.href = '/dashboard'; // example redirection
       })
       .catch(error => {
           console.error('Error during Facebook login:', error);
       });
   }
}, []);


  return <div>Logging in with Facebook...</div>;
};

export default FacebookCallback;
