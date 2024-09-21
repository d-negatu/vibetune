/*
 * Cloud Function: createSession.js
 * 
 * This file defines the createSession Cloud Function which handles the creation 
 * of user sessions in the Firestore database. It generates a unique session ID for 
 * each user and stores it along with the user ID and timestamp in the 'sessions' 
 * collection in Firestore. If a session already exists for the user, it retrieves 
 * the existing session ID.
 * 
 * The createSession function performs the following steps:
 * - Extracts the userId from the request data.
 * - Checks if a session already exists for the given userId.
 * - If a session exists, it retrieves and returns the existing session ID.
 * - If no session exists, it generates a new session ID, stores it in Firestore, 
 *   and returns the new session ID.
 * - Handles errors and sends appropriate responses.
 * 
 * Usage:
 * This function is designed to be used as a Firebase Cloud Function and can be 
 * triggered via an HTTP POST request. The function expects a JSON payload with 
 * a userId field.
 * 
 * Example Request:
 * {
 *   "userId": "exampleUserId"
 * }
 * 
 * Example Response:
 * {
 *   "sessionId": "session_exampleUserId_1625154073131"
 * }
 * 
 * Dependencies:
 * - Firebase Admin SDK for Firestore operations.
 */


const { firestore } = require('firebase-admin');

// Define the createSession Cloud Function
const createSession = async (req, res) => {
  console.log("Function createSession called with data:", req.body);
  // Extract userId from the request data
  const { userId } = req.body;
  // Get a reference to Firestore
  const db = firestore();

  try { 
  //Query Firestore for a session document with the matching userId
   const q = db.collection('sessions').where('userId', '==', userId);
   const sessionSnapshot = await q.get();

   // Check if any session document is found
   if (!sessionSnapshot.empty) {
    const sessionDoc = sessionSnapshot.docs[0];
    const sessionId = sessionDoc.data().sessionId;
    console.log("Existing session found with ID:", sessionId);
    res.json({ sessionId: sessionId });
   }else {
    // Generate a unique sessionId using the current timestamp
    const sessionId = `session_${userId}_${new Date().getTime()}`;
    console.log("Generated sessionId:", sessionId);

    // Add a new session document to the 'sessions' collection
    await db.collection('sessions').add({
      userId: userId,
      sessionId: sessionId,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
    console.log("Session successfully created with ID:", sessionId);
    // Return the sessionId as a response
    res.json({ sessionId: sessionId });
   } 

  }catch (error) {
    console.error("Error creating session:", error);
    // Handle errors and send an error response
    res.status(500).send('Unable to create session');
  }
};


//Export createSession cloud function securely to the client-side 
module.exports = { createSession };
