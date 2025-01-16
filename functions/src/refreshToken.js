// Import required modules
const cors = require('cors');
const fetch = require('node-fetch');
const {firestore} = require('firebase-admin');


// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({origin: true});


/**
 * refreshSpotifyToken - A Firebase Cloud Function to refresh Spotify access tokens.
 * This function handles requests to refresh a Spotify access token using the refresh token stored in Firestore.
 * 
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.userId - The unique identifier for the user.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {void} Responds with JSON indicating the new access token or an error message.
 */
// Function to refresh access token
const refreshSpotifyToken = async (req, res) => {
     // Use CORS to handle the request
    corsHandler(req, res, async () => { // Ensure the method is POST
        if (req.method === 'POST') { 
            try {
                // Extract userId from the request body
                const { userId } = req.body;
                if (!userId) {
                    return res.status(400).json({ message: 'Missing required parameters' });
                }

                 // Get a reference to Firestore
                const db = firestore();

                // Retrieve the document for the user
                const doc = await db.collection('tokens').doc(userId).get();
                if (!doc.exists) {
                    return res.status(404).json({ message: 'User not found' });
                }

                // Extract the refreshToken from the document
                const { refreshToken } = doc.data();

                const clientId = '0f1ee9de998e44a992767466ac7619db';
                const clientSecret = '6cea239f00a244d9ab2160cc61bf5557';
                const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

                // Make a POST request to Spotify's token endpoint to refresh the access token
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${authString}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken
                    })
                });

                
                const data = await response.json();
                const newAccessToken = data.access_token;

                // Update Firestore with the new access token and timestamp
                await db.collection('tokens').doc(userId).update({
                    accessToken: newAccessToken,
                    updatedAt: firestore.FieldValue.serverTimestamp()
                });
                
                // Respond with the new access token
                res.status(200).json({ accessToken: newAccessToken });
                
            } catch (error) {
                console.error('Error refreshing token:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    });
};

// Export the Cloud Functions
module.exports = { refreshSpotifyToken };