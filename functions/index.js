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

// Import the storeAccessToken function
const { storeToken } = require('./src/storeToken.js');

//Import the refereshAccessToken function
const{ refreshSpotifyToken} = require('./src/refreshSpotifyToken.js');

//Import the retrievetoken function
const{retrieveTokens} = require('./src/retrieveTokens.js');

//Import the refereshSpotifyToken function
const{fetchSpotifyData} = require("./src/fetchSpotifyData.js")


//Import the musicPostHanlder function
const{musicPostHandler} = require("./src/musicPostHandler.js");


//Import getMusicFeed 
const{getMusicFeed} = require("./src/getMusicFeed.js");

//Import updateLikes
const{updateLikes} = require("./src/updateLikes.js");

// Import user profile functions
const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  getUserById,
  toggleFollow,
  getUserFollowers,
  getUserFollowing
} = require('./src/userProfile.js');

// Import createUser function
const { createUser } = require('./src/createUser.js');

// Export the createSession function as an HTTP endpoint
//a POST request to create a new session in Sync Bot .
exports.createSession = functions.https.onRequest(createSession);

// Export the currentSession function as an HTTP endpoint
exports.currentSession = functions.https.onRequest(currentSession);

// Export the deleteSession function as an HTTP endpoint
exports.deleteSession = functions.https.onRequest(currentSession);

// Export the storeAccessToken function as an HTTP endpoint
exports.storeToken = functions.https.onRequest(storeToken);

//Export the referesh token function as an HTTP endpoint
exports.refreshSpotifyToken = functions.https.onRequest(refreshSpotifyToken);

//Export the retrieve token function as an HTTP endpoint
exports.retrieveTokens = functions.https.onRequest(retrieveTokens);


//Export the fetchSpotifyData function as an HTTP endpoint
exports.fetchSpotifyData = functions.https.onRequest(fetchSpotifyData);


//Export the musicHandler function as an HTTP endpoint
exports.musicPostHandler = functions.https.onRequest(musicPostHandler);

//Export getMusicFeed fucniton as an HTTP endpoint
exports.getMusicFeed = functions.https.onRequest(getMusicFeed);

//Export updateLikes function as an HTTP endpoint
exports.updateLikes = functions.https.onRequest(updateLikes);

// Export user profile functions as HTTP endpoints
exports.getUserProfile = functions.https.onRequest(getUserProfile);
exports.createUserProfile = functions.https.onRequest(createUserProfile);
exports.updateUserProfile = functions.https.onRequest(updateUserProfile);
exports.getUserById = functions.https.onRequest(getUserById);
exports.toggleFollow = functions.https.onRequest(toggleFollow);
exports.getUserFollowers = functions.https.onRequest(getUserFollowers);
exports.getUserFollowing = functions.https.onRequest(getUserFollowing);

// Export createUser function as HTTP endpoint
exports.createUser = functions.https.onRequest(createUser);