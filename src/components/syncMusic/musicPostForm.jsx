import React, { useState } from 'react';
import './musicPostForm.css';

const MusicPostForm = ({ onPostSubmit }) => {
  const [type, setType] = useState('track');
  const [spotifyId, setSpotifyId] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!spotifyId || !note) {
      alert('Please fill out all fields');
      return;
    }

    setIsSubmitting(true);

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
      
      // Reset form
      setSpotifyId('');
      setNote('');
      setType('track');
      
      onPostSubmit(); // Callback to refresh posts or handle UI updates
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="music-post-form-container">
      <form onSubmit={handleSubmit} className="music-post-form">
        <div className="form-group">
          <label className="form-label">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            className="form-input"
            disabled={isSubmitting}
          >
            <option value="track">Track</option>
            <option value="artist">Artist</option>
            <option value="playlist">Playlist</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Spotify ID</label>
          <input
            type="text"
            value={spotifyId}
            onChange={(e) => setSpotifyId(e.target.value)}
            placeholder="Enter Spotify ID"
            className="form-input"
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Share your thoughts about this music..."
            className="form-textarea"
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !spotifyId || !note}
        >
          {isSubmitting ? 'Posting...' : 'Share Vibe'}
        </button>
      </form>
    </div>
  );
};

export default MusicPostForm;