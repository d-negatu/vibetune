import React, { useState } from 'react';

const MusicPostForm = ({ onPostSubmit }) => {
  const [type, setType] = useState('track');
  const [spotifyId, setSpotifyId] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!spotifyId || !note) {
      alert('Please fill out all fields');
      return;
    }

    const postData = {
      userId: 'example-user-id', // Replace with the logged-in user's ID
      type,
      id: spotifyId,
      note,
    };

    try {
      const response = await fetch('https://us-central1-mapbot-9a988.cloudfunctions.net/musicPostHandler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('Post created successfully:', data);
      onPostSubmit(); // Callback to refresh posts or handle UI updates
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Type:
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="track">Track</option>
          <option value="artist">Artist</option>
          <option value="playlist">Playlist</option>
        </select>
      </label>
      <br />
      <label>
        Spotify ID:
        <input
          type="text"
          value={spotifyId}
          onChange={(e) => setSpotifyId(e.target.value)}
          placeholder="Enter Spotify ID"
        />
      </label>
      <br />
      <label>
        Note:
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write a short note"
        />
      </label>
      <br />
      <button type="submit">Post</button>
    </form>
  );
};

export default MusicPostForm;