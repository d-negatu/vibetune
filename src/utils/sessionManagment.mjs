/**
 * Session Management Module
 * 
 * This module provides functions to manage user sessions using Firestore
 * and localStorage. It includes functions to create a session, retrieve
 * the current session ID, and end a session.
 * 
 * Functions:
 * - createSession: Creates a new session for a user, stores the session
 *   ID in Firestore, and saves it in localStorage.
 * - getCurrentSession: Retrieves the current session ID from localStorage.
 * - endSession: Ends the current session by removing the session ID from
 *   Firestore and localStorage.
 * 
 * Usage:
 * Import this module in your application to manage user sessions. The
 * module uses `node-localstorage` to simulate localStorage in a Node.js
 * environment for development and testing purposes.
 */

import { db } from '../firebase.mjs';
import fetch from 'node-fetch';



import { collection, addDoc, query, where, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';


//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database
const createSessionUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/createSession';
//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database
const currentSessionUrl = "https://us-central1-mapbot-9a988.cloudfunctions.net/currentSession"
//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database
const deleteSessionUrl = "https://us-central1-mapbot-9a988.cloudfunctions.net/deleteSession";

const fetchAirQualityAirUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/fetchAirQuality';




/*
 * Creates a new session for the specified user by calling the Cloud Function.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<string>} - The ID of the created session.
 */
export async function createSession(userId) {
  try {
    const response = await fetch(createSessionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Error creating session: ${response.statusText}`);
    }

    const data = await response.json();
    const { sessionId } = data;
    return sessionId;
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    throw error;
  }
}



/**
 * Retrieves the current session ID from Firestore.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {string} - The current session ID, or null if not found.
 */
export async function getCurrentSession(userId) {
  
  try {
    //Make a POST request to HTTP endpoint to create a user session.
    const response = await fetch(currentSessionUrl, {
      //POST request features such as Method of request and body.
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
  
    //Request succesful; Error has occured sending response back from HTTP endpoint.
    if (!response.ok) {
      throw new Error(`Error getting current session: ${response.statusText}`);
    }


    //Retrieve data in json data format.
    const data = await response.json();
    const { sessionId } = data;
    return sessionId;

  //Error has occured upon POST request. 
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    throw error;
  }

  }


  // Function to fetch air quality data
  export async function getAirQualityData() {
    // Hardcoded latitude and longitude
    const lat = 35.3482177;
    const lng = -83.189674;
  
    try {
      // Make a POST request to the Cloud Function
      const response = await fetch(fetchAirQualityAirUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng }), // Send lat and lng in the request body
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching air quality data: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Air Quality Data:', data); // Log the air quality data
      return data;
  
    } catch (error) {
      console.error('Error:', error);
    }
  }
  


  /**
 * Deletes the current session by calling the Cloud Function.
 * 
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 */
export async function deleteSession(userId) {
  try {
    const response = await fetch(deleteSessionUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      throw new Error(`Error deleting session: ${response.statusText}`);
    }

    console.log('Session successfully deleted');
  } catch (error) {
    console.error('Error calling Cloud Function:', error);
    throw error;
  }
}