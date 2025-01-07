const cors = require('cors');

const corsHandler = cors({origin: true});

const {firestore} = require('firebase-admin');


// Function to refresh access token
const refreshSpotifyToken = async (req, res) => {
    corsHandler(req, res, async () => {
        if (req.method === 'POST') {
            try {
                const { userId } = req.body;
                if (!userId) {
                    return res.status(400).json({ message: 'Missing required parameters' });
                }

                const db = firestore();
                const doc = await db.collection('tokens').doc(userId).get();
                if (!doc.exists) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const { refreshToken } = doc.data();
                const clientId = '0f1ee9de998e44a992767466ac7619db';
                const clientSecret = '6cea239f00a244d9ab2160cc61bf5557';
                const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

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

                await db.collection('tokens').doc(userId).update({
                    accessToken: newAccessToken,
                    updatedAt: firestore.FieldValue.serverTimestamp()
                });

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