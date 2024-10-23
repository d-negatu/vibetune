import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import{getAirQualityData} from '../../assets/airQualityApi';

const GOOGLE_MAPS_API_KEY = "AIzaSyAg9aDrjkiASr6DZrQVb7ll2HQ9lfRslXQ";
//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database


// Define an async function to call the air quality API
const fetchAirQualityData = async () => {
  try {
    // Example call to the function
    const air = await getAirQualityData({ 
      universalAqi: true, 
      location: { latitude: 35.3482177, longitude: -83.189674 },
      extraComputations: [
        "HEALTH_RECOMMENDATIONS",
        "DOMINANT_POLLUTANT_CONCENTRATION",
        "POLLUTANT_CONCENTRATION",
        "LOCAL_AQI",
        "POLLUTANT_ADDITIONAL_INFO"
      ],
      languageCode: "en"
    });

    // Log the air quality data
    console.log(air.data);
  } catch (error) {
    console.error('Error fetching air quality data:', error);
  }
};

// Call the async function
fetchAirQualityData();



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
          //getAirQualityData();
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
        radius: 15,  // Adjust radius as needed
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