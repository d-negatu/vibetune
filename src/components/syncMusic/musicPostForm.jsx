import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './musicPostForm.css';

const MusicPostForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const { userProfile } = useUserProfile();
  
  const [formData, setFormData] = useState({
    caption: '',
    selectedTrack: null,
    mood: '',
    isPublic: true
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const moods = [
    { value: 'happy', label: 'Happy', emoji: '😊' },
    { value: 'sad', label: 'Sad', emoji: '😢' },
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'chill', label: 'Chill', emoji: '😌' },
    { value: 'romantic', label: 'Romantic', emoji: '💕' },
    { value: 'nostalgic', label: 'Nostalgic', emoji: '🌅' },
    { value: 'motivated', label: 'Motivated', emoji: '💪' },
    { value: 'melancholic', label: 'Melancholic', emoji: '🌧️' }
  ];

  // Mock search results for demonstration
  const mockSearchResults = [
    {
      id: 'track1',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 200000,
      preview_url: 'https://p.scdn.co/mp3-preview/example1.mp3',
      spotifyUrl: 'https://open.spotify.com/track/0VjIjW4UAa4X6jCq5qjIcf'
    },
    {
      id: 'track2',
      name: 'Levitating',
      artist: 'Dua Lipa',
      album: 'Future Nostalgia',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 203000,
      preview_url: 'https://p.scdn.co/mp3-preview/example2.mp3',
      spotifyUrl: 'https://open.spotify.com/track/463CkQjx2Zf1y3u0htLzaL'
    },
    {
      id: 'track3',
      name: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 178000,
      preview_url: 'https://p.scdn.co/mp3-preview/example3.mp3',
      spotifyUrl: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const filteredResults = mockSearchResults.filter(track =>
        track.name.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  const handleTrackSelect = (track) => {
    setFormData(prev => ({
      ...prev,
      selectedTrack: track
    }));
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleMoodSelect = (mood) => {
    setFormData(prev => ({
      ...prev,
      mood: mood.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.selectedTrack) {
      setError('Please select a track to share');
      return;
    }

    if (!formData.caption.trim()) {
      setError('Please add a caption');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const newPost = {
        id: Date.now(),
        user: {
          id: user?.uid || 'user1',
          name: userProfile?.displayName || 'User',
          avatar: userProfile?.profilePicture || 'https://randomuser.me/api/portraits/men/6.jpg',
          verified: false
        },
        track: formData.selectedTrack,
        caption: formData.caption,
        mood: formData.mood,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        isLiked: false,
        spotifyUrl: formData.selectedTrack.spotifyUrl
      };

      if (onSubmit) {
        onSubmit(newPost);
      }
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-post-form">
      <div className="form-container">
        <div className="form-header">
          <h2>Share Your Music 🎵</h2>
          <button className="close-button" onClick={onCancel}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Track Selection */}
          <div className="form-section">
            <label className="section-label">Select Track</label>
            
            {!formData.selectedTrack ? (
              <div className="track-search">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search for a song..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      handleSearch(e.target.value);
                    }}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>

                {isSearching && (
                  <div className="search-loading">
                    <span>Searching...</span>
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="search-results">
                    {searchResults.map(track => (
                      <div
                        key={track.id}
                        className="search-result-item"
                        onClick={() => handleTrackSelect(track)}
                      >
                        <img src={track.image} alt={track.name} className="result-image" />
                        <div className="result-info">
                          <h4>{track.name}</h4>
                          <p>{track.artist} • {track.album}</p>
                          <span className="duration">{formatDuration(track.duration)}</span>
                        </div>
                        <button type="button" className="select-button">
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="selected-track">
                <img src={formData.selectedTrack.image} alt={formData.selectedTrack.name} />
                <div className="track-details">
                  <h3>{formData.selectedTrack.name}</h3>
                  <p>{formData.selectedTrack.artist} • {formData.selectedTrack.album}</p>
                </div>
                <button
                  type="button"
                  className="change-track-button"
                  onClick={() => setFormData(prev => ({ ...prev, selectedTrack: null }))}
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Caption */}
          <div className="form-section">
            <label className="section-label">What's on your mind?</label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Share your thoughts about this song..."
              className="caption-input"
              rows="4"
              maxLength="500"
            />
            <div className="character-count">
              {formData.caption.length}/500
            </div>
          </div>

          {/* Mood Selection */}
          <div className="form-section">
            <label className="section-label">How does this song make you feel?</label>
            <div className="mood-selection">
              {moods.map(mood => (
                <button
                  key={mood.value}
                  type="button"
                  className={`mood-button ${formData.mood === mood.value ? 'selected' : ''}`}
                  onClick={() => handleMoodSelect(mood)}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="form-section">
            <label className="privacy-setting">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              />
              <span className="privacy-text">
                <strong>Make this post public</strong>
                <small>Allow others to see and interact with your post</small>
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting || !formData.selectedTrack || !formData.caption.trim()}
            >
              {isSubmitting ? 'Sharing...' : 'Share Music 🎵'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MusicPostForm;