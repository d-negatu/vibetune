// GoogleMapsComponent.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyCiCpGFCrISLgE6sft9HwA7CFmlcBqPZAs";

const containerStyle = {
  width: '100%',
  height: '100vh',
};

function GoogleMapsComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ lat: -3.745, lng: -38.523 });
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        () => null
      );
    }
  }, []);

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback((map) => {
    setMap(null);
  }, []);

  const calculateRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();

      const origin = currentPosition;
      const destination = { lat: 37.7749, lng: -122.4194 }; // Example: San Francisco

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );
    }
  };

  useEffect(() => {
    calculateRoute();
  }, [map, currentPosition]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentPosition}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={currentPosition} />
      {directions && <DirectionsRenderer directions={directions} />}
    </GoogleMap>
  ) : (
    <div>Loading...</div>
  );
}

export default GoogleMapsComponent;
