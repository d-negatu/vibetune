import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './discoverPage.css';

const DiscoverPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('trending'); // trending, genres, new-releases, artists
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDiscoverData();
  }, []);

  const fetchDiscoverData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual Spotify API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrendingTracks([
        {
          id: '1',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          albumArt: 'https://via.placeholder.com/150',
          spotifyUri: 'spotify:track:1',
          popularity: 95,
          duration: '3:20'
        },
        {
          id: '2',
          title: 'Levitating',
          artist: 'Dua Lipa',
          albumArt: 'https://via.placeholder.com/150',
          spotifyUri: 'spotify:track:2',
          popularity: 92,
          duration: '3:23'
        },
        {
          id: '3',
          title: 'Good 4 U',
          artist: 'Olivia Rodrigo',
          albumArt: 'https://via.placeholder.com/150',
          spotifyUri: 'spotify:track:3',
          popularity: 88,
          duration: '2:58'
        }
      ]);

      setNewReleases([
        {
          id: '4',
          title: 'Midnight City',
          artist: 'M83',
          albumArt: 'https://via.placeholder.com/150',
          spotifyUri: 'spotify:track:4',
          releaseDate: '2024-01-15',
          duration: '4:03'
        },
        {
          id: '5',
          title: 'Electric Dreams',
          artist: 'Synthwave Artist',
          albumArt: 'https://via.placeholder.com/150',
          spotifyUri: 'spotify:track:5',
          releaseDate: '2024-01-12',
          duration: '3:45'
        }
      ]);

      setFeaturedPlaylists([
        {
          id: 'playlist1',
          name: 'Today\'s Top Hits',
          description: 'The most played songs right now',
          image: 'https://via.placeholder.com/200',
          tracksCount: 50,
          owner: 'Spotify'
        },
        {
          id: 'playlist2',
          name: 'Discover Weekly',
          description: 'Your weekly mixtape of fresh music',
          image: 'https://via.placeholder.com/200',
          tracksCount: 30,
          owner: 'Spotify'
        }
      ]);

      setGenres([
        { name: 'Pop', color: '#FF6B6B', tracksCount: 1250 },
        { name: 'Rock', color: '#4ECDC4', tracksCount: 980 },
        { name: 'Hip Hop', color: '#45B7D1', tracksCount: 1100 },
        { name: 'Electronic', color: '#96CEB4', tracksCount: 750 },
        { name: 'Jazz', color: '#FFEAA7', tracksCount: 420 },
        { name: 'Classical', color: '#DDA0DD', tracksCount: 380 }
      ]);

    } catch (err) {
      console.error('Error fetching discover data:', err);
      setError('Failed to load discover content');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    console.log('Playing track:', track.title);
    // Implement Spotify playback
  };

  const handleAddToPlaylist = (track) => {
    console.log('Adding to playlist:', track.title);
    // Implement add to playlist functionality
  };

  const renderTrendingContent = () => (
    <div className="trending-content">
      <div className="section-header">
        <h2>🔥 Trending Now</h2>
        <p>What's hot in music right now</p>
      </div>
      
      <div className="tracks-grid">
        {trendingTracks.map((track, index) => (
          <div key={track.id} className="track-card glassmorphism">
            <div className="track-rank">#{index + 1}</div>
            <img src={track.albumArt} alt={track.title} className="track-image" />
            <div className="track-info">
              <h3 className="track-title">{track.title}</h3>
              <p className="track-artist">{track.artist}</p>
              <div className="track-meta">
                <span className="popularity">🔥 {track.popularity}%</span>
                <span className="duration">{track.duration}</span>
              </div>
            </div>
            <div className="track-actions">
              <button className="play-btn" onClick={() => handlePlayTrack(track)}>▶️</button>
              <button className="add-btn" onClick={() => handleAddToPlaylist(track)}>➕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNewReleases = () => (
    <div className="new-releases-content">
      <div className="section-header">
        <h2>🆕 New Releases</h2>
        <p>Fresh music from your favorite artists</p>
      </div>
      
      <div className="releases-grid">
        {newReleases.map((release) => (
          <div key={release.id} className="release-card glassmorphism">
            <img src={release.albumArt} alt={release.title} className="release-image" />
            <div className="release-info">
              <h3 className="release-title">{release.title}</h3>
              <p className="release-artist">{release.artist}</p>
              <p className="release-date">Released: {release.releaseDate}</p>
            </div>
            <div className="release-actions">
              <button className="play-btn" onClick={() => handlePlayTrack(release)}>▶️</button>
              <button className="add-btn" onClick={() => handleAddToPlaylist(release)}>➕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGenres = () => (
    <div className="genres-content">
      <div className="section-header">
        <h2>🎵 Browse by Genre</h2>
        <p>Explore music by your favorite genres</p>
      </div>
      
      <div className="genres-grid">
        {genres.map((genre) => (
          <div 
            key={genre.name} 
            className="genre-card glassmorphism"
            style={{ '--genre-color': genre.color }}
          >
            <div className="genre-icon" style={{ backgroundColor: genre.color }}>
              🎵
            </div>
            <h3 className="genre-name">{genre.name}</h3>
            <p className="genre-count">{genre.tracksCount} tracks</p>
            <button className="explore-genre-btn">Explore</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeaturedPlaylists = () => (
    <div className="playlists-content">
      <div className="section-header">
        <h2>📋 Featured Playlists</h2>
        <p>Curated playlists for every mood</p>
      </div>
      
      <div className="playlists-grid">
        {featuredPlaylists.map((playlist) => (
          <div key={playlist.id} className="playlist-card glassmorphism">
            <img src={playlist.image} alt={playlist.name} className="playlist-image" />
            <div className="playlist-info">
              <h3 className="playlist-name">{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
              <div className="playlist-meta">
                <span className="tracks-count">{playlist.tracksCount} tracks</span>
                <span className="playlist-owner">by {playlist.owner}</span>
              </div>
            </div>
            <button className="play-playlist-btn">▶️ Play</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'trending':
        return renderTrendingContent();
      case 'new-releases':
        return renderNewReleases();
      case 'genres':
        return renderGenres();
      case 'playlists':
        return renderFeaturedPlaylists();
      default:
        return renderTrendingContent();
    }
  };

  if (loading) {
    return (
      <div className="discover-loading">
        <div className="spinner"></div>
        <p>Discovering amazing music...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discover-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchDiscoverData} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="discover-page">
      <div className="discover-header">
        <h1>🎵 Discover Music</h1>
        <p>Find your next favorite song</p>
      </div>

      <div className="discover-tabs">
        <button 
          className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          🔥 Trending
        </button>
        <button 
          className={`tab-btn ${activeTab === 'new-releases' ? 'active' : ''}`}
          onClick={() => setActiveTab('new-releases')}
        >
          🆕 New Releases
        </button>
        <button 
          className={`tab-btn ${activeTab === 'genres' ? 'active' : ''}`}
          onClick={() => setActiveTab('genres')}
        >
          🎵 Genres
        </button>
        <button 
          className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          📋 Playlists
        </button>
      </div>

      <div className="discover-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default DiscoverPage;


