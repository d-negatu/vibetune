/**
 * Session Management Module
 * 
 * This module provides functions to manage user sessions using Firestore
 * and localStorage. It includes functions to create a session, retrieve
 * the current session ID, and end a session.
 * 
 * Functions:
 * - createSession: Creates a new session for a user, stores the session
 *   ID in Firestore, and saves it in localStorage.
 * - getCurrentSession: Retrieves the current session ID from localStorage.
 * - endSession: Ends the current session by removing the session ID from
 *   Firestore and localStorage.
 * 
 * Usage:
 * Import this module in your application to manage user sessions. The
 * module uses `node-localstorage` to simulate localStorage in a Node.js
 * environment for development and testing purposes.
 */


import { db } from '../firebase.mjs';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';


//URL of deployed Cloud Function createSession that securely creates a session on Google Cloud
const createSessionUrl = 'https://us-central1-mapbot-426401.cloudfunctions.net/createSession';

/**
 * Creates a new session for the specified user.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} - The ID of the created session.
 */



/**
 * Creates a new session for the specified user by calling the Cloud Function.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} - The ID of the created session.
 */
export async function createSession(userId) {
  try {
    const response = await fetch(createSessionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Error creating session: ${response.statusText}`);
    }

    const data = await response.json();
    const { sessionId } = data;
    return sessionId;
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    throw error;
  }
}



/**
 * Retrieves the current session ID from Firestore.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string|null>} - The current session ID, or null if not found.
 */
export async function getCurrentSession(userId) {
  const q = query(collection(db, 'user_sessions'), where('userId', '==', userId));
  const sessionSnapshot = await getDocs(q);

  if (!sessionSnapshot.empty) {
    const sessionDoc = sessionSnapshot.docs[0];
    return sessionDoc.data().sessionId;
  } else {
    return null;
  }
}

/**
 * Ends the current session by removing the session ID from Firestore.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export async function endSession(userId) {
  const sessionId = await getCurrentSession(userId);
  if (sessionId) {
    const q = query(collection(db, 'user_sessions'), where('sessionId', '==', sessionId));
    const sessionSnapshot = await getDocs(q);
    sessionSnapshot.forEach(async (sessionDoc) => {
      await deleteDoc(doc(db, 'user_sessions', sessionDoc.id));
    });
  }
}