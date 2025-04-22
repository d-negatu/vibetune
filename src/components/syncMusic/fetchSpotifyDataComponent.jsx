import React, { useState } from 'react';

const FetchSpotifyDataComponent = () => {
  // State to manage userId input, loading status, and response messages
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  // Replace this with your actual Firebase Cloud Function URL
  const cloudFunctionUrl = 'https://us-central1-mapbot-9a988.cloudfunctions.net/fetchSpotifyData';

  // Function to handle form submission
  const handleFetchSpotifyData = async (event) => {
    event.preventDefault(); // Prevent form reload
    setLoading(true);
    setResponseMessage('');

    try {
      // Make POST request to the Cloud Function
      const response = await fetch(cloudFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      // Parse the response
      if (response.ok) {
        const data = await response.json();
        setResponseMessage(data.message || 'Spotify data fetched successfully!');
      } else {
        const errorData = await response.json();
        setResponseMessage(`Error: ${errorData.message || 'Something went wrong'}`);
      }
    } catch (error) {
      setResponseMessage(`Error this: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Fetch Spotify Data</h1>
      <form onSubmit={handleFetchSpotifyData}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="userId" style={{ display: 'block', marginBottom: '5px' }}>
            User ID:
          </label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Fetching...' : 'Fetch Data'}
        </button>
      </form>
      {responseMessage && (
        <div
          style={{
            marginTop: '20px',
            padding: '10px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '5px',
          }}
        >
          {responseMessage}
        </div>
      )}
    </div>
  );
};

export default FetchSpotifyDataComponent;