/*
 * This file defines the deleteSession Cloud Function which
 * handles the deletion of user sessions in the Firestore database.
 * It finds the session based on the user ID and deletes it.
 *
 * Functionality:
 * - The function is triggered via an HTTP POST request.
 * - It expects a JSON body containing the userId of the session to be deleted.
 * - It queries the Firestore database for a session document matching the userId.
 * - If a session is found, it deletes the session document.
 * - If no session is found, it returns a 404 status code.
 * - If an error occurs during the process, it returns a 500 status code.
 * 
 * Usage:
 * 
 * To call this function, make a POST request to the deployed endpoint with a JSON body:
 * {
 *   "userId": "user123"
 * }
 * 
 * Example Request:
 * POST /deleteSession
 * {
 *   "userId": "user123"
 * }
 * 
 * Example Response:
 * - 200: "Session ended successfully"
 * - 404: "Session not found"
 * - 500: "Unable to end session"
 */

// Import necessary modules from Firebase Admin SDK
const { firestore } = require('firebase-admin');

// Define the deleteSession Cloud Function
const deleteSessions = async (req, res) => {
  console.log("Function deleteSessions called with data:", req.body);

  // Extract userId from the request data
  const { userId } = req.body;
  const db = firestore();

  try {
    // Query Firestore for session documents with the matching userId
    const q = db.collection('sessions').where('userId', '==', userId);
    const sessionSnapshot = await q.get();

    // Check if any session documents are found
    if (!sessionSnapshot.empty) {
      // Iterate through all matching session documents and delete them
      const batch = db.batch();
      sessionSnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();

      console.log("All sessions successfully deleted for user:", userId);
      res.status(200).json({ message: 'All sessions ended successfully', userId: userId });
    } else {
      console.log("No sessions found for user:", userId);
      res.status(404).json({ message: 'Sessions not found' });
    }
  } catch (error) {
    console.error("Error ending sessions:", error);
    res.status(500).json({ message: 'Unable to end sessions' });
  }
};

// Export the deleteSessions cloud function
module.exports = { deleteSessions };
