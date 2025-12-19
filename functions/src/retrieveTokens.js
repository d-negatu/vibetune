/**
 * A Firebase Cloud Function to retrieve and store Spotify tokens in Firestore.
 * Handles CORS, validates request parameters, and stores tokens securely.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.code - The authorization code received from Spotify.
 * @param {string} req.body.userId - The unique identifier for the user.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {void} Responds with JSON indicating success or failure.
 */

const cors = require('cors');
const fetch = require('node-fetch');
const { firestore } = require('firebase-admin');


// Initialize the CORS middleware
const corsHandler = cors({ 
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
});

// Define the retrieveTokens Cloud Function
const retrieveTokens = async (req, res) => {
    // Use CORS to handle the request
    corsHandler(req, res, async () => {
     
            try {
                // Extract the authorization code and userId from the request body
                const { code, userId } = req.body;

                // Ensure that the necessary data is present
                if (!code || !userId) {
                    return res.status(400).json({ message: 'Missing query parameters' });
                }

                const clientId = '0f1ee9de998e44a992767466ac7619db';  // Replace with your Spotify client ID
                const clientSecret = '6cea239f00a244d9ab2160cc61bf5557';  // Replace with your Spotify client secret
                const redirectUri = 'http://127.0.0.1:5173/callback';  // Must match the redirect URI you specified in Spotify Developer Dashboard

                // Exchange the authorization code for access and refresh tokens
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64')
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: redirectUri
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    const { access_token, refresh_token, expires_in } = data;

                    // Get a reference to Firestore
                    const db = firestore();

                    // Store the tokens in Firestore
                    await db.collection('tokens').doc(userId).set({
                        accessToken: access_token,
                        refreshToken: refresh_token,
                        expiresIn: expires_in,
                        createdAt: firestore.FieldValue.serverTimestamp()
                    });

                    console.log("Tokens stored successfully for user:", userId);
                    res.status(200).json({ message: 'Tokens stored successfully' });
                } else {
                    res.status(response.status).json(data);
                }
                
            } catch (error) {
                console.error('Error retrieving tokens:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        
    });
};

// Export the retrieveTokens Cloud Function
module.exports = { retrieveTokens };