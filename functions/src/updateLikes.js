const cors = require('cors');
const { firestore } = require('firebase-admin');

// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

/**
 * Cloud Function: Update Likes
 * Increments or decrements the likes count for a music post.
 *
 * Request Body Parameters:
 * - postId: The ID of the post to update.
 * - increment: Boolean, true to increment, false to decrement.
 */
const updateLikes = async (req, res) => {
  // Use CORS to handle cross-origin requests
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received request to update likes');

        // Step 1: Extract and validate request body parameters
        const { postId, increment } = req.body;
        if (!postId || typeof increment !== 'boolean') {
          console.error('[ERROR] Invalid request parameters');
          return res.status(400).json({ message: 'Invalid request parameters' });
        }

        // Step 2: Get a reference to Firestore
        const db = firestore();
        const postRef = db.collection('musicPosts').doc(postId);

        // Step 3: Atomically update the likes count
        await postRef.update({
          likes: firestore.FieldValue.increment(increment ? 1 : -1),
        });

        console.log(`[INFO] Likes successfully ${increment ? 'incremented' : 'decremented'} for postId: ${postId}`);
        res.status(200).json({ message: 'Likes updated successfully' });
      } catch (error) {
        console.error('[ERROR] Error updating likes:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

module.exports = { updateLikes };