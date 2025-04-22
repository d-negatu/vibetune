// Import required modules
const cors = require('cors');
const { firestore } = require('firebase-admin');

// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

/**
 * musicPostHandler - A Firebase Cloud Function to handle music posts.
 * Users can post a song, artist, or playlist with a short note.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.userId - The unique identifier for the user.
 * @param {string} req.body.type - The type of music post (e.g., 'track', 'artist', 'playlist').
 * @param {string} req.body.id - The Spotify ID of the track, artist, or playlist.
 * @param {string} req.body.note - A short note or caption for the post.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {void} Responds with JSON indicating success or an error message.
 */
const musicPostHandler = async (req, res) => {
  // Use CORS to handle the request
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received request to create a music post');

        // Step 1: Extract and validate the request body
        const { userId, type, id, note } = req.body;
        if (!userId || !type || !id || !note) {
          console.error('[ERROR] Missing required parameters in request body');
          return res.status(400).json({ message: 'Missing required parameters' });
        }

        // Step 2: Get a reference to Firestore
        const db = firestore();

        // Step 3: Create a new music post
        const post = {
          userId,
          type, // 'track', 'artist', or 'playlist'
          id, // Spotify ID
          note,
          timestamp: firestore.FieldValue.serverTimestamp(),
        };

        // Save the post to the 'musicPosts' collection
        await db.collection('musicPosts').add(post);

        console.log('[INFO] Music post created successfully');
        res.status(200).json({ message: 'Music post created successfully' });
      } catch (error) {
        console.error('[ERROR] Error creating music post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

// Export the Cloud Function
module.exports = { musicPostHandler };