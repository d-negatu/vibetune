import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import{getAirQualityData} from '../../assets/airQualityApi';

const GOOGLE_MAPS_API_KEY = "AIzaSyAg9aDrjkiASr6DZrQVb7ll2HQ9lfRslXQ";
//URL of deployed Cloud Function createSession that securely creates a session on Firebase firestore database



const fetchHeatmapTile = async (zoom, x, y) => {
  const response = await fetch(`https://airquality.googleapis.com/v1/mapTypes/US_AQI/heatmapTiles/2/0/1?key=AIzaSyAg9aDrjkiASr6DZrQVb7ll2HQ9lfRslXQ`);
  if (response.ok) {
    console.log("Response is in ok state.")
    const blob = await response.blob();
    const objectURL = URL.createObjectURL(blob);
    console.log("Object URL for the heatmap tile:", objectURL); // Print the URL to the console
    return objectURL;
  } else {
    console.error("Error fetching heatmap tile:", response.statusText);
    return null;
  }
};

// Test the function and print the result
fetchHeatmapTile(2, 0, 1);


const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 38.89511,  // Default center (Washington DC)
  lng: -77.03637
};



//async function addHeatmapTileOverlay(map, zoom, tileX, tileY) {
  //const tileUrl = await fetchHeatmapTile(zoom, tileX, tileY);
  //if (tileUrl) {
    //const heatmapTile = new window.google.maps.ImageMapType({
    // getTileUrl: () => tileUrl,
     // tileSize: new window.google.maps.Size(256, 256), // Standard tile size
    //  opacity: 0.7, // Adjust opacity as needed
    //});

   // map.mapTypes.set('heatmap', heatmapTile);
    //map.setMapTypeId('heatmap'); // Switch to the heatmap type
 // }
//}


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



      const zoom = 2; // Set your desired zoom level
      const tileX = 0; // Set the desired tile X coordinate
      const tileY = 1; // Set the desired tile Y coordinate
      
      // Call the addHeatmapTileOverlay function to add the heatmap overlay
      //addHeatmapTileOverlay(map, zoom, tileX, tileY);




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