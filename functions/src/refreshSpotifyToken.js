// Import required modules
const cors = require('cors');
const fetch = require('node-fetch');
const { firestore } = require('firebase-admin');

// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

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
const refreshSpotifyToken = async (req, res) => {
  // Use CORS to handle the request
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received refresh token request');

        // Step 1: Extract userId from the request body
        const { userId } = req.body;
        if (!userId) {
          console.error('[ERROR] Missing userId in request');
          return res.status(400).json({ message: 'Missing required parameter: userId' });
        }
        console.log(`[INFO] Processing request for userId: ${userId}`);

        // Step 2: Get a reference to Firestore
        const db = firestore();

        // Step 3: Retrieve the document for the user
        let doc;
        try {
          doc = await db.collection('tokens').doc(userId).get();
        } catch (firestoreError) {
          console.error('[ERROR] Failed to retrieve user document from Firestore:', firestoreError);
          return res.status(500).json({ message: 'Failed to access Firestore' });
        }

        if (!doc.exists) {
          console.error('[ERROR] User document not found in Firestore');
          return res.status(404).json({ message: 'User not found' });
        }

        // Step 4: Extract the refresh token
        const { refreshToken } = doc.data();
        if (!refreshToken) {
          console.error('[ERROR] Missing refresh token in Firestore document for userId:', userId);
          return res.status(500).json({ message: 'Missing refresh token in user data' });
        }

        console.log('[INFO] Refresh token retrieved successfully');

        // Step 5: Prepare Spotify API request
        const clientId = '0f1ee9de998e44a992767466ac7619db'; // Replace with your Spotify client ID
        const clientSecret = '6cea239f00a244d9ab2160cc61bf5557'; // Replace with your Spotify client secret
        const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

        let spotifyResponse;
        try {
          spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${authString}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: refreshToken,
            }),
          });
        } catch (networkError) {
          console.error('[ERROR] Failed to connect to Spotify API:', networkError);
          return res.status(500).json({ message: 'Failed to connect to Spotify API' });
        }

        // Step 6: Handle Spotify API response
        if (!spotifyResponse.ok) {
          let errorDetails;
          try {
            errorDetails = await spotifyResponse.json();
          } catch (jsonError) {
            errorDetails = { message: 'Unknown error from Spotify API' };
          }
          console.error('[ERROR] Spotify API error:', errorDetails);
          return res.status(500).json({ message: 'Failed to refresh token via Spotify', error: errorDetails });
        }

        const data = await spotifyResponse.json();
        const newAccessToken = data.access_token;

        if (!newAccessToken) {
          console.error('[ERROR] Missing access token in Spotify API response');
          return res.status(500).json({ message: 'Spotify API did not return an access token' });
        }

        console.log('[INFO] New access token retrieved successfully');

        // Step 7: Update Firestore with the new access token and timestamp
        try {
          await db.collection('tokens').doc(userId).update({
            accessToken: newAccessToken,
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
          console.log('[INFO] Access token updated successfully in Firestore');
        } catch (firestoreUpdateError) {
          console.error('[ERROR] Failed to update Firestore with new access token:', firestoreUpdateError);
          return res.status(500).json({ message: 'Failed to update access token in Firestore' });
        }

        // Step 8: Respond with the new access token
        res.status(200).json({ accessToken: newAccessToken });
      } catch (error) {
        console.error('[ERROR] Unexpected error in refreshSpotifyToken:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

// Export the Cloud Functions
module.exports = { refreshSpotifyToken };