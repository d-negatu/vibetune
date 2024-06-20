/*
 * This file defines the createSession Cloud Function which
 * handles the creation of user sessions in the Firestore database.
 * It generates a unique session ID for each user and stores it along with
 * the user ID and timestamp in the 'sessions' collection in Firestore.
 */

const { firestore } = require('firebase-admin');

// Define the createSession Cloud Function
const createSession = async (req, res) => {
  console.log("Function createSession called with data:", req.body);
  // Extract userId from the request data
  const { userId } = req.body;

  // Generate a unique sessionId using the current timestamp
  const sessionId = `session_${userId}_${new Date().getTime()}`;

  // Get a reference to Firestore
  const db = firestore();
  console.log("Generated sessionId:", sessionId);

  try {
    // Add a new session document to the 'sessions' collection
    await db.collection('sessions').add({
      userId: userId,
      sessionId: sessionId,
      createdAt: firestore.FieldValue.serverTimestamp()
    });
    console.log("Session successfully created with ID:", sessionId);
    // Return the sessionId as a response
    res.json({ sessionId: sessionId });
  } catch (error) {
    console.error("Error creating session:", error);
    // Handle errors and send an error response
    res.status(500).send('Unable to create session');
  }
};


//Export createSession cloud function securely to the client-side 
module.exports = { createSession };
