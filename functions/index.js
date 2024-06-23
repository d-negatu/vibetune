/*
 * index.js
 *
 * This file serves as the entry point for defining Cloud Functions for Firebase.
 * It imports necessary modules from Firebase Functions and the Firebase Admin SDK,
 * initializes the Firebase Admin SDK, and sets up the HTTP endpoints for the
 * Cloud Functions defined in the project.
 *
 * Functions:
 * - createSession: Handles the creation of user sessions in the Firestore database.
 *
 * How to Use:
 * - Deploy this file to Firebase Cloud Functions using the Firebase CLI.
 * - The createSession function will be available as an HTTP endpoint, allowing
 *   external clients to create user sessions by sending a POST request with
 *   the necessary data.
 */

// Import necessary modules from Firebase Functions and Firebase Admin SDK
const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize the Firebase Admin SDK
admin.initializeApp();

// Import the createSession function
const { createSession } = require('./src/createSession.js');
//Import the currentSession function
const { currentSession } = require('./src/currentSession.js');
//Import the deleteSession function
const {deleteSession} = require('./src/deleteSession.js')

// Export the createSession function as an HTTP endpoint
//a POST request to create a new session in Sync Bot .
exports.createSession = functions.https.onRequest(createSession);

// Export the currentSession function as an HTTP endpoint
exports.currentSession = functions.https.onRequest(currentSession);

// Export the deleteSession function as an HTTP endpoint
exports.deleteSession = functions.https.onRequest(currentSession);
