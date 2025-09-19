/**
 * @file api.js
 * @description Provides a utility function for interacting with the refresh token endpoint in Firebase Cloud Functions. 
 * This function facilitates refreshing Spotify access tokens using the user's unique identifier (userId).
 */

/**
 * Refreshes the Spotify access token by calling the `refreshSpotifyToken` endpoint hosted on Firebase.
 * 
 * This function sends a POST request with the userId in the body to the Firebase Cloud Function endpoint. 
 * Upon a successful request, it returns the new access token data. If the request fails, 
 * it handles errors gracefully by logging them and returning `null`.
 * 
 * @async
 * @function refreshToken
 * 
 * @param {string} userId - The unique identifier for the user whose Spotify access token needs to be refreshed. 
 * It must match the corresponding user document in the Firestore database.
 * 
 * @returns {Promise<Object|null>} - Resolves to the JSON response from the server, containing the new access token.
 * Returns `null` if an error occurs during the request or if the response status is not OK.
 * 
 * @throws {Error} - Throws an error if the fetch request fails (e.g., network issue or server error).
 * 
 */


const tokenUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/refreshToken';

// Function to call the refresh token endpoint
export const refreshToken = async (userId) => {
    try {
        const response = await fetch(tokenUrl, {
            method: 'POST', // Use POST to send data to the server
            headers: {
                'Content-Type': 'application/json',  // Set request headers for JSON payload
            },
            body: JSON.stringify({ userId }) // Pass the userId in the request body
        });

        if (!response.ok) {
            // Check if the response status is not in the range 200-299
            throw new Error('Failed to refresh token');
        }

        const data = await response.json(); // Parse the response JSON
        return data; // Return the parsed JSON containing the new access token

    } catch (error) {
        // Log any errors that occur during the request or processing
        console.error('Error refreshing token:', error);
        // Return null to indicate failure
        return null;
    }
};

// Default export for compatibility
export default { refreshToken };