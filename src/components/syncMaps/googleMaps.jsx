import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyC4u8hB9PThuC9_m7qWHNNZIqhw-DrtKzA";
const AIR_QUALITY_API_KEY = "AIzaSyC4u8hB9PThuC9_m7qWHNNZIqhw-DrtKzA"


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
  async function getAirQualityData(lat, lng) {
    const airQualityApiKey = AIR_QUALITY_API_KEY; // Make sure to replace this with your actual key
    const url = `https://airquality.googleapis.com/v1/current?location=${lat},${lng}&resolution=500&key=${airQualityApiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch air quality data');
      }
      
      const data = await response.json();
      console.log('Air Quality Data:', data); // Print the data in console
      
      // Optionally, you can set this data in state to display in the app
      return data;
    } catch (error) {
      console.error('Error fetching air quality data:', error);
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

          // Fetch air quality data for the user's location
          getAirQualityData(latitude, longitude);
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