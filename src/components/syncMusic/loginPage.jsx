/**
 * LoginPage.jsx
 * 
 * This component is responsible for handling user login to Spotify through
 * Auth2 authorization.The user is redirected to Spotify's login page where
 * they are prompted to authenticate and grant necessary permissions.
 * After a successful login, the user is redirected to the provided callback
 * URI with an access token in the URL fragment.
 * 
 * @module LoginPage
 */


// Client ID and redirect URI should be obtained from Spotify Developer Dashboard
// These values are necessary for OAuth2 authentication flow.
import React from "react";
import './loginPage.css'; // Import your CSS file for styling

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// Redirect URI to your application (must match what is configured in Spotify Dashboard)
const redirectUri = "http://localhost:5173/callback"; 

const scopes = [
    "user-read-private",//permission to access user's private data (e.g., username)
    "user-read-email", // permission to access user's email address
    "user-read-playback-state", // permission to read the current playback state
    "user-modify-playback-state", // Grants permission to control playback
    "streaming",// Grants permission to stream music
].join("%20"); // Encode spaces as %20



/**
 * handleLogin function
 * 
 * This function constructs the authorization URL for Spotify's OAuth2 flow 
 * and redirects the user to the Spotify login page. The user is required to
 * log in and authorize the application with the requested permissions.
 * Once authorized, Spotify redirects the user back to the callback
 * URI with an access token.
 * 
 * @function
 */

const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&show_dialog=true`;
    console.log("Redirecting to:", authUrl);
    window.location.href = authUrl; // Redirect user to Spotify login page
};



/**
 * LoginPage Component
 * 
 * The LoginPage component renders a simple UI with a title and a login button.
 * When the button is clicked, the handleLogin function is invoked to initiate
 * the OAuth2 flow.
 * 
 * @component
 */


const LoginPage = () => {
    return (
        <div className="login-page">
            <div className="login-container">
                <div className="header">
                    <img src="/logo.png" alt="Music App Logo" className="logo" />
                    <h1>Sign in</h1>
                </div>
                <div className="form-group">
                    <input type="text" placeholder="Email, phone, or Skype" className="input-field" />
                </div>
                <div className="form-group">
                    <input type="password" placeholder="Password" className="input-field" />
                </div>
                <div className="form-group">
                    <button className="login-button" onClick={handleLogin}>Sign in with Spotify</button>
                </div>
                <div className="footer">
                    <a href="#">Can't access your account?</a>
                </div>
            </div>
        </div>
    );
};

// Export the LoginPage component as the default export of this module
export default LoginPage;
