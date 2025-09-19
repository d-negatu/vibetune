import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './libraryPage.css';

const LibraryPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('playlists'); // playlists, tracks, albums, artists
  const [playlists, setPlaylists] = useState([]);
  const [savedTracks, setSavedTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  useEffect(() => {
    fetchLibraryData();
  }, []);

  const fetchLibraryData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual Spotify API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setPlaylists([
        {
          id: 'playlist1',
          name: 'My Favorites',
          description: 'Songs I love',
          image: 'https://via.placeholder.com/200',
          tracksCount: 25,
          isPublic: false,
          createdAt: '2024-01-01'
        },
        {
          id: 'playlist2',
          name: 'Workout Mix',
          description: 'High energy tracks for the gym',
          image: 'https://via.placeholder.com/200',
          tracksCount: 40,
          isPublic: true,
          createdAt: '2024-01-05'
        },
        {
          id: 'playlist3',
          name: 'Chill Vibes',
          description: 'Relaxing music for lazy days',
          image: 'https://via.placeholder.com/200',
          tracksCount: 30,
          isPublic: false,
          createdAt: '2024-01-10'
        }
      ]);

      setSavedTracks([
        {
          id: 'track1',
          title: 'Blinding Lights',
          artist: 'The Weeknd',
          album: 'After Hours',
          albumArt: 'https://via.placeholder.com/150',
          duration: '3:20',
          addedAt: '2024-01-15'
        },
        {
          id: 'track2',
          title: 'Levitating',
          artist: 'Dua Lipa',
          album: 'Future Nostalgia',
          albumArt: 'https://via.placeholder.com/150',
          duration: '3:23',
          addedAt: '2024-01-14'
        },
        {
          id: 'track3',
          title: 'Good 4 U',
          artist: 'Olivia Rodrigo',
          album: 'SOUR',
          albumArt: 'https://via.placeholder.com/150',
          duration: '2:58',
          addedAt: '2024-01-13'
        }
      ]);

      setAlbums([
        {
          id: 'album1',
          title: 'After Hours',
          artist: 'The Weeknd',
          image: 'https://via.placeholder.com/200',
          tracksCount: 14,
          releaseYear: 2020,
          addedAt: '2024-01-15'
        },
        {
          id: 'album2',
          title: 'Future Nostalgia',
          artist: 'Dua Lipa',
          image: 'https://via.placeholder.com/200',
          tracksCount: 11,
          releaseYear: 2020,
          addedAt: '2024-01-14'
        }
      ]);

      setArtists([
        {
          id: 'artist1',
          name: 'The Weeknd',
          image: 'https://via.placeholder.com/200',
          followers: 50000000,
          genres: ['Pop', 'R&B'],
          addedAt: '2024-01-15'
        },
        {
          id: 'artist2',
          name: 'Dua Lipa',
          image: 'https://via.placeholder.com/200',
          followers: 25000000,
          genres: ['Pop', 'Dance'],
          addedAt: '2024-01-14'
        }
      ]);

    } catch (err) {
      console.error('Error fetching library data:', err);
      setError('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    console.log('Playing track:', track.title);
    // Implement Spotify playback
  };

  const handlePlayPlaylist = (playlist) => {
    console.log('Playing playlist:', playlist.name);
    // Implement playlist playback
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist = {
      id: `playlist_${Date.now()}`,
      name: newPlaylistName,
      description: 'New playlist',
      image: 'https://via.placeholder.com/200',
      tracksCount: 0,
      isPublic: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setPlaylists(prev => [newPlaylist, ...prev]);
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
  };

  const handleDeletePlaylist = (playlistId) => {
    setPlaylists(prev => prev.filter(p => p.id !== playlistId));
  };

  const filteredData = (data) => {
    if (!searchQuery) return data;
    return data.filter(item => 
      item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderPlaylists = () => (
    <div className="playlists-content">
      <div className="content-header">
        <h2>📋 My Playlists</h2>
        <button 
          className="create-playlist-btn"
          onClick={() => setShowCreatePlaylist(true)}
        >
          ➕ Create Playlist
        </button>
      </div>
      
      <div className="playlists-grid">
        {filteredData(playlists).map((playlist) => (
          <div key={playlist.id} className="playlist-card glassmorphism">
            <img src={playlist.image} alt={playlist.name} className="playlist-image" />
            <div className="playlist-info">
              <h3 className="playlist-name">{playlist.name}</h3>
              <p className="playlist-description">{playlist.description}</p>
              <div className="playlist-meta">
                <span className="tracks-count">{playlist.tracksCount} tracks</span>
                <span className={`privacy ${playlist.isPublic ? 'public' : 'private'}`}>
                  {playlist.isPublic ? '🌐 Public' : '🔒 Private'}
                </span>
              </div>
            </div>
            <div className="playlist-actions">
              <button 
                className="play-btn"
                onClick={() => handlePlayPlaylist(playlist)}
              >
                ▶️
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDeletePlaylist(playlist.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSavedTracks = () => (
    <div className="tracks-content">
      <div className="content-header">
        <h2>❤️ Liked Songs</h2>
        <span className="tracks-count">{savedTracks.length} songs</span>
      </div>
      
      <div className="tracks-list">
        {filteredData(savedTracks).map((track) => (
          <div key={track.id} className="track-item glassmorphism">
            <img src={track.albumArt} alt={track.title} className="track-image" />
            <div className="track-info">
              <h3 className="track-title">{track.title}</h3>
              <p className="track-artist">{track.artist}</p>
              <p className="track-album">{track.album}</p>
            </div>
            <div className="track-meta">
              <span className="duration">{track.duration}</span>
              <span className="added-date">Added {track.addedAt}</span>
            </div>
            <button 
              className="play-btn"
              onClick={() => handlePlayTrack(track)}
            >
              ▶️
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAlbums = () => (
    <div className="albums-content">
      <div className="content-header">
        <h2>💿 Saved Albums</h2>
        <span className="albums-count">{albums.length} albums</span>
      </div>
      
      <div className="albums-grid">
        {filteredData(albums).map((album) => (
          <div key={album.id} className="album-card glassmorphism">
            <img src={album.image} alt={album.title} className="album-image" />
            <div className="album-info">
              <h3 className="album-title">{album.title}</h3>
              <p className="album-artist">{album.artist}</p>
              <div className="album-meta">
                <span className="tracks-count">{album.tracksCount} tracks</span>
                <span className="release-year">{album.releaseYear}</span>
              </div>
            </div>
            <button 
              className="play-btn"
              onClick={() => console.log('Playing album:', album.title)}
            >
              ▶️
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderArtists = () => (
    <div className="artists-content">
      <div className="content-header">
        <h2>👤 Following</h2>
        <span className="artists-count">{artists.length} artists</span>
      </div>
      
      <div className="artists-grid">
        {filteredData(artists).map((artist) => (
          <div key={artist.id} className="artist-card glassmorphism">
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <div className="artist-info">
              <h3 className="artist-name">{artist.name}</h3>
              <p className="artist-followers">
                {artist.followers.toLocaleString()} followers
              </p>
              <div className="artist-genres">
                {artist.genres.map((genre, index) => (
                  <span key={index} className="genre-tag">{genre}</span>
                ))}
              </div>
            </div>
            <button 
              className="unfollow-btn"
              onClick={() => console.log('Unfollowing:', artist.name)}
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return renderPlaylists();
      case 'tracks':
        return renderSavedTracks();
      case 'albums':
        return renderAlbums();
      case 'artists':
        return renderArtists();
      default:
        return renderPlaylists();
    }
  };

  if (loading) {
    return (
      <div className="library-loading">
        <div className="spinner"></div>
        <p>Loading your library...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="library-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchLibraryData} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>📚 Your Library</h1>
        <p>All your saved music in one place</p>
      </div>

      <div className="library-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search your library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="library-tabs">
        <button 
          className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          📋 Playlists
        </button>
        <button 
          className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracks')}
        >
          ❤️ Liked Songs
        </button>
        <button 
          className={`tab-btn ${activeTab === 'albums' ? 'active' : ''}`}
          onClick={() => setActiveTab('albums')}
        >
          💿 Albums
        </button>
        <button 
          className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
          onClick={() => setActiveTab('artists')}
        >
          👤 Artists
        </button>
      </div>

      <div className="library-content">
        {renderContent()}
      </div>

      {/* Create Playlist Modal */}
      {showCreatePlaylist && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Playlist</h3>
            <input
              type="text"
              placeholder="Playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className="playlist-name-input"
            />
            <div className="modal-actions">
              <button 
                onClick={handleCreatePlaylist}
                className="create-btn"
                disabled={!newPlaylistName.trim()}
              >
                Create
              </button>
              <button 
                onClick={() => setShowCreatePlaylist(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;


