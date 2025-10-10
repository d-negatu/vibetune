/**
 * Firebase Configuration and Initialization File
 * 
 * This file sets up and configures Firebase services for the application, 
 * including Firestore for database management and Firebase Analytics for
 * collecting analytics data. It handles the initialization of Firebase and 
 * conditionally initializes Firebase Analytics to avoid errors in
 * non-browser environments.
 * 
 * Functionality:
 * - Initializes Firebase with the given configuration.
 * - Sets up Firestore for database operations.
 * - Conditionally initializes Firebase Analytics to
 *  avoid ReferenceError in server-side environments.
 */
// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics,  isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDL5V5Kzmt5HHXxGGuT7ckoRi6dHunfvTs",
  authDomain: "mapbot-9a988.firebaseapp.com",
  projectId: "mapbot-9a988",
  storageBucket: "mapbot-9a988.firebasestorage.app",
  messagingSenderId: "938260712730",
  appId: "1:938260712730:web:9eb0cf1f25b0c6919570a3",
  measurementId: "G-EPRKBHTWZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if running in a browser)
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      getAnalytics(app);
    }
  });
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };