/**
 * A Firebase Cloud Function to retrieve the current user's YouTube access token.
 * Verifies Firebase ID token (Bearer) or accepts a direct userId in the body.
 */
const cors = require('cors');
const { firestore, auth } = require('firebase-admin');

const corsHandler = cors({ origin: true });

const getYouTubeToken = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received get current YouTube token request');

        const authHeader = req.headers.authorization;
        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
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
          const { userId: directUserId } = req.body;
          if (!directUserId) {
            console.error('[ERROR] Missing userId in request body');
            return res.status(400).json({ message: 'Missing required parameter: userId' });
          }
          userId = directUserId;
          console.log(`[INFO] Using direct userId: ${userId}`);
        }

        const db = firestore();
        let doc;
        try {
          doc = await db.collection('tokens').doc(userId).get();
        } catch (err) {
          console.error('[ERROR] Failed to access Firestore:', err);
          return res.status(500).json({ message: 'Failed to access Firestore' });
        }

        if (!doc.exists) {
          console.log('[INFO] No token document for user:', userId);
          return res.status(404).json({ message: 'User not found or no tokens stored' });
        }

        const tokenData = doc.data();
        const accessToken = tokenData?.youtubeAccessToken || null;

        if (!accessToken) {
          console.log('[INFO] No YouTube access token for user:', userId);
          return res.status(404).json({ message: 'No YouTube access token found' });
        }

        return res.status(200).json({ accessToken, userId });
      } catch (error) {
        console.error('[ERROR] Unexpected error in getYouTubeToken:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

module.exports = { getYouTubeToken };
