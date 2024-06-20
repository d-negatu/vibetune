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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCiCpGFCrISLgE6sft9HwA7CFmlcBqPZAs",
  authDomain: "mapbot-426401.firebaseapp.com",
  projectId: "mapbot-426401",
  storageBucket: "mapbot-426401.appspot.com",
  messagingSenderId: "99514484065",
  appId: "1:99514484065:web:311caba5b77993ff31b120",
  measurementId: "G-9H6LSMJ771"
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

export { db };