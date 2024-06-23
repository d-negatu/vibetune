
/**
 * Cloud Function: currentSession
 * 
 * This file defines the getCurrentSession Cloud Function which
 * handles the retrieval of user sessions from the Firestore database.
 * It searches for a session ID for the specified user and returns it.
 * If no session is found, it returns a 404 status. If an error occurs,
 * it returns a 500 status.
 * 
 * HTTP Method: POST
 * Endpoint: /getCurrentSession
 * 
 * Request:
 * - JSON object containing `userId`.
 * 
 * Response:
 * - JSON object containing `sessionId` if found.
 * - 404 status if no session is found.
 * - 500 status if an error occurs.
 * 
 * Usage:
 * This function is intended to be deployed as a Firebase Cloud Function.
 * It should be invoked via HTTP POST requests.
 */

// Import necessary modules
const { firestore } = require('firebase-admin');

/**
 * Cloud Function: getCurrentSession
 * 
 * This function retrieves the current session ID for a given user from Firestore.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const currentSession = async (req, res) => {
  console.log("Function getCurrentSession called with data:", req.body);


  // Extract userId from the request body
  const { userId } = req.body;
  const db = firestore();

  try {

    //Query Firestore for a session document with the matching userId
    const q = db.collection('sessions').where('userId', '==', userId);
    const sessionSnapshot = await q.get();

    // Check if any session document is found
    if (!sessionSnapshot.empty) {
      //
      const sessionDoc = sessionSnapshot.docs[0];
      const sessionId = sessionDoc.data().sessionId;
      console.log("Session found with ID:", sessionId);
      // Return the sessionId as a JSON response
      res.json({ sessionId: sessionId });
    } else {
      console.log("No session found for user:", userId);
      // Return 404 if no session is found
      res.status(404).send('Session not found');
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
      // Return 500 if an error occurs
    res.status(500).send('Unable to retrieve session');
  }
};

// Export the currentSession cloud function
module.exports = { currentSession };
