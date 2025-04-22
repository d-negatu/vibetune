// Import required modules
const cors = require('cors');
const fetch = require('node-fetch');
const { firestore } = require('firebase-admin');

// Initialize CORS middleware to allow requests from any origin
const corsHandler = cors({ origin: true });

/**
 * fetchSpotifyData - A Firebase Cloud Function to fetch Spotify user data and store it in Firestore.
 * This function ensures the access token is valid by calling the refreshSpotifyToken function if needed.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request (must be 'POST').
 * @param {Object} req.body - The body of the HTTP request.
 * @param {string} req.body.userId - The unique identifier for the user.
 * @param {Object} res - The HTTP response object.
 *
 * @returns {void} Responds with JSON indicating success or an error message.
 */
const fetchSpotifyData = async (req, res) => {
  // Use CORS to handle the request
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        console.log('[INFO] Received request to fetch Spotify data');

        // Step 1: Extract userId from the request body
        const { userId } = req.body;
        if (!userId) {
          console.error('[ERROR] Missing userId in request body');
          return res.status(400).json({ message: 'Missing required parameter: userId' });
        }
        console.log(`[INFO] Fetching data for userId: ${userId}`);

        // Step 2: Get a reference to Firestore
        const db = firestore();

        // Step 3: Retrieve the document for the user
        let doc;
        try {
          doc = await db.collection('tokens').doc(userId).get();
        } catch (firestoreError) {
          console.error('[ERROR] Failed to access Firestore:', firestoreError);
          return res.status(500).json({ message: 'Failed to access Firestore' });
        }

        if (!doc.exists) {
          console.error('[ERROR] User document not found in Firestore');
          return res.status(404).json({ message: 'User not found' });
        }

        const { accessToken, refreshToken } = doc.data();
        if (!accessToken || !refreshToken) {
          console.error('[ERROR] Missing accessToken or refreshToken in Firestore document');
          return res.status(500).json({ message: 'Missing authentication tokens in user data' });
        }
        console.log('[INFO] Tokens retrieved successfully from Firestore');

        // Step 4: Validate or refresh the access token
        let validAccessToken = accessToken;
        const tokenAgeLimit = 3600 * 1000; // 1 hour in milliseconds
        const tokenUpdatedAt = doc.data().updatedAt?.toMillis() || 0;
        const tokenAge = Date.now() - tokenUpdatedAt;

        if (tokenAge > tokenAgeLimit) {
          console.log('[INFO] Access token expired, refreshing token...');
          try {
            const refreshResponse = await fetch('https://us-central1-mapbot-9a988.cloudfunctions.net/refreshSpotifyToken', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId }),
            });

            if (!refreshResponse.ok) {
              const refreshError = await refreshResponse.json();
              console.error('[ERROR] Failed to refresh access token:', refreshError);
              throw new Error('Failed to refresh access token');
            }

            const refreshData = await refreshResponse.json();
            validAccessToken = refreshData.accessToken;
            console.log('[INFO] Access token refreshed successfully');
          } catch (refreshError) {
            console.error('[ERROR] Error during token refresh:', refreshError);
            return res.status(500).json({ message: 'Failed to refresh access token' });
          }
        }

        // Step 5: Fetch Spotify user profile data
        let userProfile;
        try {
          const userProfileResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${validAccessToken}` },
          });

          if (!userProfileResponse.ok) {
            const profileError = await userProfileResponse.json();
            console.error('[ERROR] Failed to fetch user profile from Spotify:', profileError);
            throw new Error('Failed to fetch user profile from Spotify');
          }

          userProfile = await userProfileResponse.json();
          console.log('[INFO] Successfully fetched Spotify user profile');
        } catch (userProfileError) {
          console.error('[ERROR] Error fetching Spotify user profile:', userProfileError);
          return res.status(500).json({ message: 'Failed to fetch Spotify user profile' });
        }

        // Step 6: Fetch Spotify top tracks
        let topTracks;
        try {
          const topTracksResponse = await fetch('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${validAccessToken}` },
          });

          if (!topTracksResponse.ok) {
            const tracksError = await topTracksResponse.json();
            console.error('[ERROR] Failed to fetch top tracks from Spotify:', tracksError);
            throw new Error('Failed to fetch top tracks from Spotify');
          }

          topTracks = await topTracksResponse.json();
          console.log('[INFO] Successfully fetched Spotify top tracks');
        } catch (topTracksError) {
          console.error('[ERROR] Error fetching Spotify top tracks:', topTracksError);
          return res.status(500).json({ message: 'Failed to fetch Spotify top tracks' });
        }

        // Step 7: Fetch Spotify top artists
        let topArtists;
        try {
          const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${validAccessToken}` },
          });

          if (!topArtistsResponse.ok) {
            const artistsError = await topArtistsResponse.json();
            console.error('[ERROR] Failed to fetch top artists from Spotify:', artistsError);
            throw new Error('Failed to fetch top artists from Spotify');
          }

          topArtists = await topArtistsResponse.json();
          console.log('[INFO] Successfully fetched Spotify top artists');
        } catch (topArtistsError) {
          console.error('[ERROR] Error fetching Spotify top artists:', topArtistsError);
          return res.status(500).json({ message: 'Failed to fetch top artists from Spotify' });
        }

        // Step 8: Extract genres from top artists
        const topGenres = topArtists.items
          .flatMap((artist) => artist.genres)
          .slice(0, 10); // Limit to top 10 genres
        console.log('[INFO] Extracted top genres from artists');

        // Step 9: Save user profile and vibe data to Firestore
        try {
          await db.collection('userProfiles').doc(userId).set({
            spotifyId: userProfile.id,
            displayName: userProfile.display_name,
            profileImage: userProfile.images?.[0]?.url || null,
            topTracks: topTracks.items.map((track) => ({
              name: track.name,
              artist: track.artists.map((artist) => artist.name).join(', '),
            })),
            topArtists: topArtists.items.map((artist) => artist.name),
            topGenres,
            lastUpdated: firestore.FieldValue.serverTimestamp(),
          });
          console.log('[INFO] User profile and vibe data saved to Firestore');
        } catch (firestoreWriteError) {
          console.error('[ERROR] Failed to save data to Firestore:', firestoreWriteError);
          return res.status(500).json({ message: 'Failed to save user data to Firestore' });
        }

        // Step 10: Respond with success
        res.status(200).json({ message: 'Spotify data fetched and stored successfully' });
      } catch (error) {
        console.error('[ERROR] Unexpected error in fetchSpotifyData:', error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    } else {
      console.error('[ERROR] Unsupported HTTP method:', req.method);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};

// Export the Cloud Functions
module.exports = { fetchSpotifyData };