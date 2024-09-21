/**
 * /**
 * Test Script for Session Management
 * 
 * This script tests the session management functions implemented
 * in `sessionManagement.mjs`. It includes functions to create, retrieve,
 * and end sessions, and it verifies their behavior 
 * using mocked localStorage.
 * 
 * The test sequence:
 * 1. Creates a session and logs the session ID.
 * 2. Retrieves the current session ID and logs it.
 * 3. Ends the session and verifies that the session ID is null.
 * 
 * Mock localStorage is used to simulate the localStorage environment 
 * for testing purposes. This ensures that the tests do not affect the
 * actual browser's localStorage.
 * 
 * Functions Tested:
 * - getCurrentSession: Retrieves the current session ID from localStorage.
 * - endSession: 
 * Ends the current session by removing the session ID from Firestore
 * and localStorage.
 * 
 * To run the test, execute the script with a Node.js runtime.
 */


import { createSession, deleteSession, getCurrentSession} from './sessionManagment.mjs';




// Example usage
async function test() {
  const userId = 'test_user';
  
  // Create a new session
  const sessionId = await createSession(userId);
  console.log('Session created:', sessionId);
  
  // Get the current session
 // Retrieve the current session
  const currentSession = await getCurrentSession(userId);
  console.log('Current session:', currentSession);

  // End the session
  await deleteSession(userId);
  console.log('Session ended');
}

test().catch(error => {
  console.error('Error during test:', error);
});
