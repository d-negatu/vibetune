/**
 * A Firebase Cloud Function to store user access tokens in Firestore.
 * Handles CORS, validates request parameters, and stores tokens securely.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.accessToken - The user's access token.
 * @param {string} req.body.tokenType - The type of token (e.g., Bearer).
 * @param {string} req.body.userId - The unique identifier for the user.
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {void} Responds with JSON indicating success or failure.
 */


const cors = require('cors');


// Initialize the CORS middleware
const corsHandler = cors({ origin: true });  // Allow requests from any origin, or specify the origin

const { firestore } = require('firebase-admin');

// Define the storeAccessToken Cloud Function
const storeToken = async (req, res) => {
    // Use CORS to handle the request
    corsHandler(req, res, async () => {
        if (req.method === 'POST') {
            try {
                // Extract the accessToken, tokenType, and userId from the request body
                const { accessToken, tokenType, userId } = req.body;

                // Ensure that the necessary data is present
                if (!accessToken || !tokenType || !userId) {
                    return res.status(400).json({ message: 'Missing required parameters' });
                }

                // Get a reference to Firestore
                const db = firestore();

               
                const sessionId = `session_${userId}_${new Date().getTime()}`;
                console.log("Generated sessionId:", sessionId);
            
                // Add a new session document to the 'sessions' collection
                await db.collection('tokens').add({
                  token: accessToken,
                  createdAt: firestore.FieldValue.serverTimestamp()
                });

                console.log("Token stored successfully for user:", userId);
                res.status(200).json({ message: 'Token stored successfully' });
                
            } catch (error) {
                console.error('Error storing token:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        } else {
            // If method is not POST, return Method Not Allowed
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    });
};

// Export the storeAccessToken Cloud Function
module.exports = {storeToken};
