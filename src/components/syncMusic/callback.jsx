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
import { useSpotifyAuth } from "../../contexts/SpotifyAuthContext";
import { useFirebaseAuth } from "../../contexts/FirebaseAuthContext";

const retrieveUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/retrieveTokens';

const CallbackPage = () => {
    const navigate = useNavigate();
    const { refreshSpotifyAuth } = useSpotifyAuth();
    const { firebaseUser, authLoading } = useFirebaseAuth();

    useEffect(() => {
        /**
         * This function extracts the authorization code from the URL and makes a POST request
         * to the retrieveTokens cloud function to get the access and refresh tokens.
         */
        const handleCallback = async () => {
            try {
                console.log('[CallbackPage] Starting callback handling');
                
                // Wait for Firebase Auth to finish initializing (critical after page reload)
                if (authLoading) {
                    console.log('[CallbackPage] Waiting for Firebase Auth to initialize...');
                    return; // Exit early, will retry when authLoading becomes false
                }
                
                // Extract the authorization code from the URL
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');
                
                // Check for OAuth errors first
                if (error) {
                    const errorDescription = urlParams.get('error_description') || error;
                    console.error('[CallbackPage] Spotify OAuth error:', error, errorDescription);
                    alert(`Spotify authentication error: ${errorDescription}`);
                    navigate('/login');
                    return;
                }

                if (!code) {
                    console.error('[CallbackPage] Authorization code not found in URL');
                    console.log('[CallbackPage] URL params:', Object.fromEntries(urlParams));
                    navigate('/login');
                    return;
                }

                console.log('[CallbackPage] Authorization code received:', code.substring(0, 20) + '...');
                
                // Must have Firebase user to proceed (now that auth has initialized)
                if (!firebaseUser?.uid) {
                    console.error('[CallbackPage] No Firebase user found. User must be logged in first.');
                    alert('Please log in with Firebase first before connecting Spotify.');
                    navigate('/login');
                    return;
                }
                
                const userId = firebaseUser.uid;
                console.log('[CallbackPage] Using Firebase userId:', userId);

                // Send the authorization code to the retrieveTokens cloud function
                console.log('[CallbackPage] Calling retrieveTokens with:', { code: code.substring(0, 20) + '...', userId });
                const response = await fetch(retrieveUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code, userId })
                });

                console.log('[CallbackPage] Response status:', response.status);
                const data = await response.json();
                console.log('[CallbackPage] Response data:', { ...data, access_token: data.access_token ? '***' : undefined });
                
                if (response.ok) {
                    // Tokens are now stored in Firestore by the backend
                    console.log('[CallbackPage] Tokens stored in Firestore successfully');
                    
                    // Wait a moment for Firestore write to complete, then refresh connection status
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Trigger a refresh to update the context
                    console.log('[CallbackPage] Refreshing Spotify connection status');
                    refreshSpotifyAuth();
                    
                    // Wait a bit more for the check to complete, then navigate
                    await new Promise(resolve => setTimeout(resolve, 500));
                    navigate('/');
                } else {
                    console.error('[CallbackPage] Failed to retrieve tokens:', data);
                    alert(`Failed to connect Spotify: ${data.message || 'Unknown error'}`);
                    // Redirect to login page on error
                    navigate('/login');
                }
            } catch (error) {
                console.error('[CallbackPage] Error retrieving tokens:', error);
                alert(`Error connecting to Spotify: ${error.message}`);
                navigate('/login');
            }
        };

        // Execute the callback handling function
        handleCallback();
    }, [navigate, refreshSpotifyAuth, firebaseUser, authLoading]); // Added authLoading to dependencies

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