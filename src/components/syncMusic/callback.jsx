/**
 * CallbackPage Component
 * 
 * The CallbackPage component is responsible for extracting the access token
 * from the URL fragment after the user is redirected from Spotify. 
 * This token will be used for making authenticated requests to
 * Spotify's API on behalf of the user. The extraction logic is encapsulated
 * in a closure to avoid exposing sensitive data to the outside world.
 * 
 * @component
 */

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const retrieveUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/retrieveTokens';

const CallbackPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        /**
         * This function extracts the authorization code from the URL and makes a POST request
         * to the retrieveTokens cloud function to get the access and refresh tokens.
         */
        const handleCallback = async () => {
            try {
                // Extract the authorization code from the URL
                const code = new URLSearchParams(window.location.search).get('code');
                const userId = "secondUserId";  // Replace with actual user ID logic

                if (code) {
                    console.log('Authorization Code:', code);

                    // Send the authorization code to the retrieveTokens cloud function
                    const response = await fetch(retrieveUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ code, userId })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        // Store user data and mark as authenticated
                        const userData = {
                            userId: userId,
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            expiresAt: Date.now() + (data.expires_in * 1000)
                        };
                        
                        login(userData);
                        
                        // Check if user needs profile setup
                        // For now, redirect to profile setup for all new users
                        // In production, you'd check if profile exists and is completed
                        navigate('/profile-setup');
                    } else {
                        console.error('Failed to retrieve tokens:', data);
                        // Redirect to login page on error
                        navigate('/login');
                    }
                } else {
                    console.error('Authorization code not found in URL');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error retrieving tokens:', error);
                navigate('/login');
            }
        };

        // Execute the callback handling function
        handleCallback();
    }, [navigate, login]);

    // Render loading state while processing
    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh',
            background: '#1B1A1A',
            color: '#FFFFFF',
            fontFamily: 'Poppins, sans-serif'
        }}>
            <div style={{ 
                width: '40px', 
                height: '40px', 
                border: '3px solid rgba(139, 92, 246, 0.3)', 
                borderTop: '3px solid #8B5CF6', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite',
                marginBottom: '20px'
            }}></div>
            <h2>Connecting to Spotify...</h2>
            <p>Please wait while we authenticate your account.</p>
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

// Makes this component available for use in other parts of the app.
export default CallbackPage;