import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyAg9aDrjkiASr6DZrQVb7ll2HQ9lfRslXQ";
//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database
const fetchAirQualityAirUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/fetchAirQuality';


const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 38.89511,  // Default center (Washington DC)
  lng: -77.03637
};

function GoogleMapsComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['visualization'] // Add this to use the HeatmapLayer
  });

  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);

  
  // Function to fetch air quality data
  async function getAirQualityData() {

    // Hardcoded latitude and longitude
    const lat = 35.3482177;
    const lng = -83.189674;

    try {
      // Make a GET request to the Cloud Function with hardcoded lat and lng
      const response = await fetch(`${fetchAirQualityAirUrl}?lat=${lat}&lng=${lng}`);
  
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




  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.setCenter({ lat: latitude, lng: longitude });
          }
          // Call the function to fetch air quality data
          getAirQualityData();
        },
        () => null
      );
    }
  }, []);

  useEffect(() => {
    if (map) {
      // Sample data for heatmap
      const heatmapData = [
        new window.google.maps.LatLng(37.782, -122.447),
        new window.google.maps.LatLng(37.782, -122.445),
        new window.google.maps.LatLng(37.782, -122.443),
        // Add more data points here
      ];

      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 20,  // Adjust radius as needed
        opacity: 0.7 // Adjust opacity as needed
      });
      heatmap.setMap(map);

      // Add TrafficLayer to the map
      const traffic = new window.google.maps.TrafficLayer();
      traffic.setMap(map);
      setTrafficLayer(traffic); // Save TrafficLayer instance for future use

      // Clean up heatmap and traffic layers on component unmount
      return () => {
        heatmap.setMap(null);
        traffic.setMap(null);
      };
    }
  }, [map]);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || center}
        zoom={17}
        onLoad={(map) => {
          setMap(map);
          mapRef.current = map;
        }}
        onUnmount={() => {
          setMap(null);
          mapRef.current = null;
        }}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
}

export default GoogleMapsComponent;