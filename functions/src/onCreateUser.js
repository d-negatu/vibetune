/**
 * Firebase Auth trigger: creates a users/{uid} document when a new Firebase user is created.
 * Runs automatically on sign-up (e.g. createUserWithEmailAndPassword).
 *
 * @param {Object} user - Firebase Auth user object from the trigger
 * @param {string} user.uid - Firebase user ID
 * @param {string} user.email - User email (if available)
 * @param {string} user.displayName - Display name (if available)
 * @param {string} user.photoURL - Profile photo URL (if available)
 * @returns {Promise<void>}
 */

const { firestore } = require('firebase-admin');

const onCreateUser = async (user) => {
  const db = firestore();
  const userData = {
    uid: user.uid,
    displayName: user.displayName || '',
    username: '',
    avatarUrl: user.photoURL || '',
    bio: '',
    connectedServices: {
      spotify: { isConnected: false },
    },
    followerCount: 0,
    followingCount: 0,
    createdAt: firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('users').doc(user.uid).set(userData);
  console.log('User document created in Firestore:', user.uid);
};

module.exports = { onCreateUser };
