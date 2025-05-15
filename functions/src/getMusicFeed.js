const cors = require('cors');
const { firestore } = require('firebase-admin');

// CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

/**
 * Cloud Function: Retrieve Music Feed
 * Fetches music posts from Firestore based on optional filters (e.g., userId).
 *
 * Query Parameters:
 * - userId (optional): Filter by specific user ID.
 * - limit (optional): Number of posts to retrieve (default: 10).
 * - lastPostId (optional): For pagination, fetch posts after the given post ID.
 */
const getMusicFeed = async (req, res) => {
  // Use CORS to handle HTTP requests
  corsHandler(req, res, async () => {
    if (req.method === 'GET') {
      try {
        console.log('[INFO] Received request to fetch music feed');

        // Step 1: Extract query parameters
        const { userId, limit = 10, lastPostId } = req.query;

        // Step 2: Get a reference to Firestore
        const db = firestore();
        const musicPostsRef = db.collection('musicPosts');

        let query = musicPostsRef.orderBy('timestamp', 'desc').limit(Number(limit));

        // Step 3: Apply filters (if provided)
        if (userId) {
          query = query.where('userId', '==', userId);
        }

        if (lastPostId) {
          // Fetch the last document for pagination
          const lastPostDoc = await musicPostsRef.doc(lastPostId).get();
          if (lastPostDoc.exists) {
            query = query.startAfter(lastPostDoc);
          } else {
            console.warn('[WARN] Invalid lastPostId provided');
          }
        }

        // Step 4: Execute Firestore query
        const snapshot = await query.get();
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log(`[INFO] Retrieved ${posts.length} music posts`);
        res.status(200).json(posts);
      } catch (error) {
        console.error('[ERROR] Error fetching music feed:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

module.exports = { getMusicFeed };