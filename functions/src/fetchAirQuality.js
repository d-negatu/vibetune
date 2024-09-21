/*
 * Cloud Function: airQualityApi.js
 * 
 * This file defines the airQualityApi Cloud Function which fetches air quality data
 * from an external API based on latitude and longitude parameters provided in the request.
 * 
 * The airQualityApi function performs the following steps:
 * - Extracts latitude and longitude from the request query parameters.
 * - Validates the presence of latitude and longitude.
 * - Makes a request to the Air Quality API using these coordinates.
 * - Returns the air quality data in the response.
 * - Handles errors and sends appropriate responses.
 * 
 * Usage:
 * This function is designed to be used as a Firebase Cloud Function and can be triggered
 * via an HTTP GET request. The function expects query parameters `lat` and `lng`.
 * 
 * Example Request:
 * GET /airQualityApi?lat=35.3482177&lng=-83.189674
 * 
 * Example Response:
 * {
 *   "data": {
 *     "airQuality": {...} // Actual air quality data from the API
 *   }
 * }
 * 
 * Dependencies:
 * - Axios for making HTTP requests.
 */

const functions = require('firebase-functions');
const axios = require('axios');

// Define the airQualityApi Cloud Function
const airQualityApi = async (req, res) => {
  const { lat, lng } = req.query; // Extract latitude and longitude from query parameters

  // Ensure lat and lng are provided
  if (!lat || !lng) {
    return res.status(400).send('Missing latitude or longitude');
  }

  const airQualityApiKey = functions.config().air_quality.api_key; // Store your API key securely in Firebase config
  const airQualityApiUrl = `https://airquality.googleapis.com/v1/current?location=${lat},${lng}&resolution=500&key=${airQualityApiKey}`;

  try {
    const response = await axios.get(airQualityApiUrl); // Fetch air quality data
    console.log('Air Quality Data:', response.data); // Log the data
    res.json(response.data); // Return the air quality data in the response
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    res.status(500).send('Unable to fetch air quality data'); // Handle errors
  }
};

// Export airQualityApi cloud function
module.exports = { airQualityApi };
