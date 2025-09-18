import { onRequest } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export const createUser = onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, password, username } = req.body;

    // Validate input
    if (!email || !password || !username) {
      res.status(400).json({ error: 'Email, password, and username are required' });
      return;
    }

    // Create user with Firebase Auth
    const userRecord = await getAuth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    // Create user document in Firestore
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email,
      username: username,
      displayName: username,
      createdAt: new Date(),
      profileCompleted: false,
      spotifyConnected: false,
      preferences: {
        musicGenres: [],
        privacy: 'public'
      }
    });

    res.status(201).json({
      success: true,
      user: {
        uid: userRecord.uid,
        email: email,
        username: username,
        displayName: username
      }
    });

  } catch (error) {
    console.error('Error creating user:', error);
    
    let errorMessage = 'Failed to create user';
    if (error.code === 'auth/email-already-exists') {
      errorMessage = 'Email already exists';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address';
    }

    res.status(400).json({ error: errorMessage });
  }
});