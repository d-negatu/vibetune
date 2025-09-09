const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

// Lazy load Firestore to reduce initialization time
let db;
const getDb = () => {
  if (!db) {
    db = admin.firestore();
  }
  return db;
};

// CORS configuration
const corsHandler = cors({ 
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
});

// Get user profile
const getUserProfile = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ message: 'Missing userId' });
        }

        const userDoc = await getDb().collection('userProfiles').doc(userId).get();

        if (!userDoc.exists) {
          return res.status(404).json({ message: 'User profile not found' });
        }

        const userData = userDoc.data();
        res.status(200).json(userData);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Create user profile
const createUserProfile = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const userData = req.body;

        if (!userData.userId) {
          return res.status(400).json({ message: 'Missing userId' });
        }

        // Check if user already exists
        const existingUser = await getDb().collection('userProfiles').doc(userData.userId).get();
        if (existingUser.exists) {
          return res.status(409).json({ message: 'User profile already exists' });
        }

        // Add timestamps
        const now = admin.firestore.Timestamp.now();
        const profileData = {
          ...userData,
          createdAt: now,
          lastActive: now,
          updatedAt: now
        };

        await getDb().collection('userProfiles').doc(userData.userId).set(profileData);

        res.status(201).json({ message: 'User profile created successfully', profile: profileData });
      } catch (error) {
        console.error('Error creating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Update user profile
const updateUserProfile = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId, updates } = req.body;

        if (!userId || !updates) {
          return res.status(400).json({ message: 'Missing userId or updates' });
        }

        // Add update timestamp
        const updateData = {
          ...updates,
          updatedAt: admin.firestore.Timestamp.now(),
          lastActive: admin.firestore.Timestamp.now()
        };

        await getDb().collection('userProfiles').doc(userId).update(updateData);

        // Get updated profile
        const updatedDoc = await getDb().collection('userProfiles').doc(userId).get();
        const updatedProfile = updatedDoc.data();

        res.status(200).json({ message: 'User profile updated successfully', profile: updatedProfile });
      } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Get user by ID
const getUserById = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ message: 'Missing userId' });
        }

        const userDoc = await getDb().collection('userProfiles').doc(userId).get();

        if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        res.status(200).json(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Toggle follow/unfollow
const toggleFollow = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId, targetUserId, action } = req.body;

        if (!userId || !targetUserId || !action) {
          return res.status(400).json({ message: 'Missing required parameters' });
        }

        const batch = db.batch();

        if (action === 'follow') {
          // Add targetUserId to user's following list
          const userRef = getDb().collection('userProfiles').doc(userId);
          batch.update(userRef, {
            following: admin.firestore.FieldValue.arrayUnion(targetUserId),
            updatedAt: admin.firestore.Timestamp.now()
          });

          // Add userId to target user's followers list
          const targetUserRef = getDb().collection('userProfiles').doc(targetUserId);
          batch.update(targetUserRef, {
            followers: admin.firestore.FieldValue.arrayUnion(userId),
            updatedAt: admin.firestore.Timestamp.now()
          });
        } else if (action === 'unfollow') {
          // Remove targetUserId from user's following list
          const userRef = getDb().collection('userProfiles').doc(userId);
          batch.update(userRef, {
            following: admin.firestore.FieldValue.arrayRemove(targetUserId),
            updatedAt: admin.firestore.Timestamp.now()
          });

          // Remove userId from target user's followers list
          const targetUserRef = getDb().collection('userProfiles').doc(targetUserId);
          batch.update(targetUserRef, {
            followers: admin.firestore.FieldValue.arrayRemove(userId),
            updatedAt: admin.firestore.Timestamp.now()
          });
        }

        await batch.commit();

        res.status(200).json({ 
          message: `Successfully ${action}ed user`,
          action: action
        });
      } catch (error) {
        console.error('Error toggling follow:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Get user's followers
const getUserFollowers = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ message: 'Missing userId' });
        }

        const userDoc = await getDb().collection('userProfiles').doc(userId).get();

        if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const followers = userData.followers || [];

        // Get detailed info for each follower
        const followersData = await Promise.all(
          followers.map(async (followerId) => {
            const followerDoc = await getDb().collection('userProfiles').doc(followerId).get();
            if (followerDoc.exists) {
              const followerData = followerDoc.data();
              return {
                userId: followerId,
                displayName: followerData.displayName,
                profilePicture: followerData.profilePicture,
                bio: followerData.bio
              };
            }
            return null;
          })
        );

        res.status(200).json({ followers: followersData.filter(Boolean) });
      } catch (error) {
        console.error('Error fetching followers:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

// Get user's following
const getUserFollowing = async (req, res) => {
  corsHandler(req, res, async () => {
    if (req.method === 'POST') {
      try {
        const { userId } = req.body;

        if (!userId) {
          return res.status(400).json({ message: 'Missing userId' });
        }

        const userDoc = await getDb().collection('userProfiles').doc(userId).get();

        if (!userDoc.exists) {
          return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const following = userData.following || [];

        // Get detailed info for each followed user
        const followingData = await Promise.all(
          following.map(async (followingId) => {
            const followingDoc = await getDb().collection('userProfiles').doc(followingId).get();
            if (followingDoc.exists) {
              const followingUserData = followingDoc.data();
              return {
                userId: followingId,
                displayName: followingUserData.displayName,
                profilePicture: followingUserData.profilePicture,
                bio: followingUserData.bio
              };
            }
            return null;
          })
        );

        res.status(200).json({ following: followingData.filter(Boolean) });
      } catch (error) {
        console.error('Error fetching following:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  });
};

module.exports = {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getUserById,
  toggleFollow,
  getUserFollowers,
  getUserFollowing
};
