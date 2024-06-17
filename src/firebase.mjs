// Import the functions you need from the SDKs you need
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };