/**
 * This is the entry point of cloud functions.
 * Each cloud function must be exported.
 * The require statements ensure that all necessary
 * dependencies and modules are available. 
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { createSessionHandler } = require('./src/createSession');

admin.initializeApp();

// Export the createSession Cloud Function
exports.createSession = functions.https.onCall(createSessionHandler);
