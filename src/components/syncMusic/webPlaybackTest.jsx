// Test component for WebPlayback
import React, { useState, useEffect } from 'react';
import WebPlayback from './webPlayback.jsx';
import './webPlaybackTest.css';
import { useAuth } from '../../contexts/AuthContext';


function WebPlaybackTest() {
  const { user } = useAuth(); // Use Firebase Auth
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserToken = async () => {
      try {
        setIsLoading(true);
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        console.log('🔑 Getting user Spotify token via Cloud Function...');
        console.log('User ID:', user.uid);

        console.log('🔐 Using custom auth system - sending userId directly');

        // Call the cloud function to get current Spotify token
        const response = await fetch('https://us-central1-mapbot-9a988.cloudfunctions.net/getCurrentSpotifyToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.uid // Send userId directly for now
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to get Spotify token');
        }

        const tokenData = await response.json();
        console.log('✅ Spotify token retrieved via Cloud Function:', tokenData.refreshed ? 'refreshed' : 'current');
        
        setToken(tokenData.accessToken);
      } catch (err) {
        console.error('❌ Error loading user token:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserToken();
  }, [user]);

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔄 Loading Spotify Web Playback Test...</h2>
        <p>Getting authentication token...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>❌ Error Loading Test</h2>
        <p>{error}</p>
        <p><strong>Solution:</strong> You need to connect your Spotify account first.</p>
        <p>Go to your profile and link your Spotify account to use Web Playback SDK.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>❌ No Token Available</h2>
        <p>Unable to get Spotify token for testing</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎧 Spotify Web Playback SDK Test</h1>
      <p><strong>Token Status:</strong> ✅ User Token Available</p>
      <p><strong>User ID:</strong> {user?.uid || 'Unknown'}</p>
      <p><strong>Email:</strong> {user?.email || 'Unknown'}</p>
      <p><strong>Note:</strong> This requires Spotify Premium to work properly</p>
      
      <WebPlayback token={token} />
    </div>
  );
}

export default WebPlaybackTest;
