/**
 * airQualityApi.js
 * 
 * This file defines a function that fetches air quality data from an external API
 * based on latitude and longitude parameters provided.
 * 
 * Usage:
 * This function can be called directly and will log the air quality data.
 * 
 * Example Call:
 * getAirQualityData({ 
 *   universalAqi: true, 
 *   location: { latitude: 35.3482177, longitude: -83.189674 },
 *   extraComputations: [
 *     "HEALTH_RECOMMENDATIONS",
 *     "DOMINANT_POLLUTANT_CONCENTRATION",
 *     "POLLUTANT_CONCENTRATION",
 *     "LOCAL_AQI",
 *     "POLLUTANT_ADDITIONAL_INFO"
 *   ],
 *   languageCode: "en"
 * });
 * 
 * Dependencies:
 * - Axios for making HTTP requests.
 */

import axios from 'axios';

// Define the function to fetch air quality data
export const getAirQualityData = async ({ universalAqi, location, extraComputations, languageCode }) => {
  // Ensure required fields are provided
  if (!location || !location.latitude || !location.longitude) {
    console.error('Missing location data');
    return;
  }

  const airQualityApiUrl = 'https://airquality.googleapis.com/v1/currentConditions:lookup?key=AIzaSyAg9aDrjkiASr6DZrQVb7ll2HQ9lfRslXQ';

  // Create the request payload
  const payload = {
    universalAqi,
    location,
    extraComputations,
    languageCode
  };

  try {
    const response = await axios.post(airQualityApiUrl, payload); // Fetch air quality data
    return response.data; // Return the data
  } catch (error) {
    console.error('Error fetching air quality data:', error);
  }
};
