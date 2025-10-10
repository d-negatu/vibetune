/**
 * A Firebase Cloud Function to retrieve the current user's Spotify access token.
 * This function verifies the Firebase ID token and gets the user's Spotify token from Firestore.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.headers - The HTTP headers.
 * @param {string} req.headers.authorization - The Firebase ID token (Bearer token).
 * @param {Object} res - The HTTP response object.
 * 
 * @returns {void} Responds with JSON containing the access token or an error message.
 */

const cors = require('cors');
const fetch = require('node-fetch');
const { firestore, auth } = require('firebase-admin');

// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

const getCurrentSpotifyToken = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received get current Spotify token request');

        // Check for Firebase token first, fallback to direct userId
        const authHeader = req.headers.authorization;
        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
          // Firebase token authentication
          const idToken = authHeader.split('Bearer ')[1];
          try {
            const decodedToken = await auth().verifyIdToken(idToken);
            userId = decodedToken.uid;
            console.log(`[INFO] Firebase token verified for user: ${userId}`);
          } catch (tokenError) {
            console.error('[ERROR] Invalid Firebase token:', tokenError);
            return res.status(401).json({ message: 'Invalid Firebase token' });
          }
        } else {
          // Direct userId authentication (for custom auth system)
          const { userId: directUserId } = req.body;
          if (!directUserId) {
            console.error('[ERROR] Missing userId in request body');
            return res.status(400).json({ message: 'Missing required parameter: userId' });
          }
          userId = directUserId;
          console.log(`[INFO] Using direct userId: ${userId}`);
        }

        console.log(`[INFO] Processing request for userId: ${userId}`);

        // Get reference to Firestore
        const db = firestore();

        // Retrieve user's token document
        let doc;
        try {
          doc = await db.collection('tokens').doc(userId).get();
        } catch (firestoreError) {
          console.error('[ERROR] Failed to retrieve user document from Firestore:', firestoreError);
          return res.status(500).json({ message: 'Failed to access Firestore' });
        }

        if (!doc.exists) {
          console.error('[ERROR] User document not found in Firestore');
          return res.status(404).json({ message: 'User not found. Please connect your Spotify account first.' });
        }

        const tokenData = doc.data();
        const { accessToken, refreshToken, createdAt } = tokenData;

        if (!accessToken) {
          console.error('[ERROR] Missing access token in Firestore document for userId:', userId);
          return res.status(404).json({ message: 'No Spotify access token found. Please reconnect your Spotify account.' });
        }

        // Check if token is expired (Spotify tokens typically expire in 1 hour)
        const tokenAge = Date.now() - (createdAt?.toMillis() || 0);
        const isExpired = tokenAge > 50 * 60 * 1000; // 50 minutes (refresh before 1 hour)

        if (isExpired && refreshToken) {
          console.log('[INFO] Token is expired, attempting to refresh...');
          
          try {
            // Refresh the token
            const clientId = '0f1ee9de998e44a992767466ac7619db';
            const clientSecret = '6cea239f00a244d9ab2160cc61bf5557';
            const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

            const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
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

            if (refreshResponse.ok) {
              const refreshData = await refreshResponse.json();
              const newAccessToken = refreshData.access_token;

              // Update Firestore with new token
              await db.collection('tokens').doc(userId).update({
                accessToken: newAccessToken,
                updatedAt: firestore.FieldValue.serverTimestamp(),
              });

              console.log('[INFO] Token refreshed successfully');
              return res.status(200).json({ 
                accessToken: newAccessToken,
                userId: userId,
                refreshed: true 
              });
            } else {
              console.error('[ERROR] Failed to refresh token');
              return res.status(401).json({ message: 'Failed to refresh token. Please reconnect your Spotify account.' });
            }
          } catch (refreshError) {
            console.error('[ERROR] Error refreshing token:', refreshError);
            return res.status(500).json({ message: 'Error refreshing token' });
          }
        }

        console.log('[INFO] Returning current valid token');
        res.status(200).json({ 
          accessToken: accessToken,
          userId: userId,
          refreshed: false 
        });

      } catch (error) {
        console.error('[ERROR] Unexpected error in getCurrentSpotifyToken:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

module.exports = { getCurrentSpotifyToken };
