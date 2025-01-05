/**
 * CallbackPage.jsx
 * 
 * This component handles the redirect from Spotify after the user has
 * authenticated and authorized the app. It extracts the access token
 * and token type from the URL fragment, which is returned by Spotify
 * after the user logs in. The extracted token is then available for
 * use in making requests to Spotify's Web API.
 * 
 * @module CallbackPage
 */


import React, { useEffect } from "react";

const tokenUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/storeAccessToken';


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

const CallbackPage = () => {
    useEffect(() => {
        const extractAccessToken = (() => {
            const extractTokenFromUrl = () => {
                const hashParams = new URLSearchParams(window.location.hash.substring(1)); 
                const accessToken = hashParams.get('access_token');
                const tokenType = hashParams.get('token_type');

                if (accessToken && tokenType) {
                    return { accessToken, tokenType };
                } else {
                    throw new Error("Access token or token type not found in URL");
                }
            };

            return extractTokenFromUrl;
        })();

        const getAccessToken = async () => {
            try {
                const { accessToken, tokenType } = extractAccessToken();
                
                if (accessToken && tokenType) {
                    console.log("Access Token extracted:", accessToken);
                    console.log("Token Type:", tokenType);

                    // Send the token to Firebase via Cloud Function
                    const userId = "exampleUserId";  // You can get this from the user or session data

                    const response = await fetch(tokenUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ accessToken, tokenType, userId })
                    });

                    const result = await response.json();
                    console.log("Token storage response:", result);

                } else {
                    console.error("Invalid token data");
                }
            } catch (error) {
                console.error("Error extracting token:", error);
            }
        };

        getAccessToken();
    }, []);

    return (
        <div>
            <h1>Extracting Spotify Access Token...</h1>
            <p>Please wait while we extract the access token.</p>
        </div>
    );
};

export default CallbackPage;