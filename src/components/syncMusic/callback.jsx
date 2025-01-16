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

const retrieveUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/refreshToken';

const CallbackPage = () => {
    useEffect(() => {

        /**
         * This function extracts the authorization code from the URL and makes a POST request
         * to the retrieveTokens cloud function to get the access and refresh tokens.
         */
        const testRetrieveToken = async () => {
            try {
                // Extract the authorization code from the URL
                const code = new URLSearchParams(window.location.search).get('code');
                const userId = "exampleUserId";  // Replace with actual user ID logic

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
                        console.log('Access Token:', data.accessToken);
                        console.log('Refresh Token:', data.refreshToken);
                    } else {
                        console.error('Error retrieving tokens:', data);
                    }
                } else {
                    console.error('Authorization code not found in URL');
                }
            } catch (error) {
                console.error('Error retrieving tokens:', error);
            }
        };

        // Execute the testRetrieveToken function after defining it
        testRetrieveToken();
    }, []);

    // Render the Component
    return (
        <div>
            <h1>Testing Retrieve Token Endpoint...</h1>
            <p>Please wait while we test the retrieve token endpoint.</p>
        </div>
    );
};

// Makes this component available for use in other parts of the app.
export default CallbackPage;