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
import React, { useEffect } from "react";
import { Icon } from '@iconify/react';
import './loginPage.css'; // Import your CSS file for styling

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// Redirect URI to your application (must match what is configured in Spotify Dashboard)
const redirectUri = "http://localhost:5173/callback"; 

const scopes = [
    "user-read-private",//permission to access user's private data (e.g., username)
    "user-read-email", // permission to access user's email address
    "user-read-playback-state", // permission to read the current playback state
    "user-modify-playback-state", // Grants permission to control playback
    "user-top-read",       
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
    // Initialize particles when component mounts
    useEffect(() => {
        // Wait for particles.js to be available
        const initParticles = () => {
            if (window.particlesJS) {
                window.particlesJS.load('particles-js', '/particles.json', function() {
                    console.log('Particles.js loaded successfully');
                });
            } else {
                // Retry after a short delay if particles.js isn't loaded yet
                setTimeout(initParticles, 100);
            }
        };

        initParticles();

        // Cleanup function to destroy particles when component unmounts
        return () => {
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
                window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
            }
        };
    }, []);

    return (
        <div className="login-page">
            <div id="particles-js"></div>
            <div className="login-container">
                <div className="header">
                    <div className="logo">
                        <Icon
                            icon="mdi:cosine-wave"
                            className="logo-icon"
                        />
                    </div>
                    <h1 className="brand-title">Sign in to Vibetune</h1>
                </div>
                
                <div className="auth-options">
                    <button className="auth-button spotify" onClick={handleLogin}>
                        <Icon icon="mdi:spotify" className="auth-icon" />
                        <span>Continue with Spotify</span>
                    </button>
                    
                    <button className="auth-button google">
                        <Icon icon="mdi:google" className="auth-icon" />
                        <span>Continue with Google</span>
                    </button>
                    
                    <button className="auth-button apple">
                        <Icon icon="mdi:apple" className="auth-icon" />
                        <span>Continue with Apple</span>
                    </button>
                </div>
                
                <div className="divider">
                    <span>or</span>
                </div>
                
                <div className="manual-login">
                    <div className="form-group">
                        <input type="email" className="input-field" placeholder="Email address" />
                    </div>
                    <div className="form-group">
                        <input type="password" className="input-field" placeholder="Password" />
                    </div>
                    <button className="login-button">
                        <span>Log In</span>
                    </button>
                </div>
                
                <div className="footer">
                    <a href="#" className="forgot-password">Forgot your password?</a>
                    <div className="signup-link">
                        <span>Don't have an account? </span>
                        <a href="#" className="signup-text">Sign up for Vibetune</a>
                    </div>
                </div>
            </div>
            
            <div className="content-section">
                <div className="content-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">1M+</div>
                            <div className="stat-label">Songs Shared</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Playlists Created</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="footer-section">
                <div className="content-container">
                    <div className="footer-content">
                        <div className="footer-links">
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                            <a href="#" className="footer-link">Support</a>
                            <a href="#" className="footer-link">About</a>
                        </div>
                        <div className="footer-copyright">
                            <p>&copy; 2024 Vibetune. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the LoginPage component as the default export of this module
export default LoginPage;
