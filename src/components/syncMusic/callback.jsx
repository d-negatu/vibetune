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

const tokenUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/storeToken';


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

        /**
         * This is an IIFE (Immediately Invoked Function Expression)
         * It encapsulates the logic for extracting the access token to prevent external
         *  access to sensitive data and llows you to create a local scope for variables and 
         *  functions within that function, preventing them from polluting the global namespace
         *  and creating a more organized code structure; It is often used to encapsulate code
         *  and maintain data privacy within a specific section of the program
        */
        const extractAccessToken = (() => {
            const extractTokenFromUrl = () => {
                // grabs the URL fragment after the # (e.g., #access_token=XYZ&token_type=bearer).
                //new URLSearchParams() converts the fragment into a key-value pair object for easy extraction
                const hashParams = new URLSearchParams(window.location.hash.substring(1)); 

                //Get the access token
                const accessToken = hashParams.get('access_token');
                
                // Extract refresh token
                const refreshToken = hashParams.get('refresh_token'); 

                //Get the token type of the access token
                const tokenType = hashParams.get('token_type');

                //If both access_token, token_type. refresh token are present, return them as an object
                if (accessToken && tokenType) {
                    return { accessToken, refreshToken, tokenType };
                }
                // If either is missing, throw an error to indicate the data isn’t valid.
                else {
                    throw new Error("Access token or token type not found in URL");
                }
            };

            //Expose the helper function so it can be called later
            return extractTokenFromUrl;
        })();

        
        /**
         * This is an async function that will:
         * call extractAccessToken() to get the token.
         * Log the token data.
         * Send the token to the backend for storage or processing.
         */
        const getAccessToken = async () => {
            try {
                
                // Calls extractAccessToken() to get the token data.
                // Uses object destructuring to pull accessToken, refreshToken, tokenType
                // from the returned object.
                const { accessToken, refreshToken, tokenType } = extractAccessToken();
                
                
                if (accessToken && tokenType) {
                    console.log("Access Token extracted:", accessToken);
                    console.log("Refresh Token extracted:", refreshToken); // Log refresh token
                    console.log("Token Type:", tokenType);

                    // Send the token to Firebase via Cloud Function
                    const userId = "exampleUserId";  // You can get this from the user or session data

                    // Sends a POST request to a tokenUrl (a backend endpoint like a Firebase Cloud Function).
                    const response = await fetch(tokenUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ accessToken, refreshToken, tokenType, userId }) // Include refresh token
                    });

                    
                    // Waits for the server response and converts it to JSON
                    const result = await response.json();

                    console.log("Token storage response:", result);

                } else {
                    console.error("Invalid token data");
                }
            } catch (error) {
                console.error("Error extracting token:", error);
            }
        };


        // Executes the getAccessToken function after defining it.
        getAccessToken();
    }, []);

    //  Render the Component
    return (
        <div>
            <h1>Extracting Spotify Access Token...</h1>
            <p>Please wait while we extract the access token.</p>
        </div>
    );
};

//Makes this component available for use in other parts of the app.
export default CallbackPage;