// Import the functions you need from the SDKs you need
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { isSupported, getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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

// Initialize Analytics (conditionally)
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(app);
    console.log("Analytics initialized");
  } else {
    console.log("Analytics is not supported in this environment");
  }
});

// Initialize Firestore
const db = getFirestore(app);

export { db };
