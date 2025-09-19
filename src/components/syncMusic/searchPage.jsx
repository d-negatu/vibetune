import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './searchPage.css';

const SearchPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, tracks, artists, playlists, users
  const [searchResults, setSearchResults] = useState({
    tracks: [],
    artists: [],
    playlists: [],
    users: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [trendingSearches, setTrendingSearches] = useState([]);

  useEffect(() => {
    loadRecentSearches();
    loadTrendingSearches();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const debounceTimer = setTimeout(() => {
        performSearch(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSearchResults({ tracks: [], artists: [], playlists: [], users: [] });
    }
  }, [searchQuery]);

  const loadRecentSearches = () => {
    const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(recent);
  };

  const loadTrendingSearches = () => {
    // Mock trending searches
    setTrendingSearches([
      'The Weeknd', 'Dua Lipa', 'Olivia Rodrigo', 'Billie Eilish', 'Taylor Swift',
      'Pop Music', 'Chill Vibes', 'Workout Playlist', 'Indie Rock', 'Hip Hop'
    ]);
  };

  const performSearch = async (query) => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock search results - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockResults = {
        tracks: [
          {
            id: 'track1',
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours',
            albumArt: 'https://via.placeholder.com/150',
            duration: '3:20',
            popularity: 95,
            spotifyUri: 'spotify:track:1'
          },
          {
            id: 'track2',
            title: 'Levitating',
            artist: 'Dua Lipa',
            album: 'Future Nostalgia',
            albumArt: 'https://via.placeholder.com/150',
            duration: '3:23',
            popularity: 92,
            spotifyUri: 'spotify:track:2'
          }
        ],
        artists: [
          {
            id: 'artist1',
            name: 'The Weeknd',
            image: 'https://via.placeholder.com/200',
            followers: 50000000,
            genres: ['Pop', 'R&B'],
            popularity: 95
          },
          {
            id: 'artist2',
            name: 'Dua Lipa',
            image: 'https://via.placeholder.com/200',
            followers: 25000000,
            genres: ['Pop', 'Dance'],
            popularity: 88
          }
        ],
        playlists: [
          {
            id: 'playlist1',
            name: 'Today\'s Top Hits',
            description: 'The most played songs right now',
            image: 'https://via.placeholder.com/200',
            tracksCount: 50,
            owner: 'Spotify',
            isPublic: true
          },
          {
            id: 'playlist2',
            name: 'Chill Vibes',
            description: 'Relaxing music for lazy days',
            image: 'https://via.placeholder.com/200',
            tracksCount: 30,
            owner: 'musiclover23',
            isPublic: true
          }
        ],
        users: [
          {
            id: 'user1',
            username: 'musiclover23',
            displayName: 'Alex Johnson',
            profilePicture: 'https://via.placeholder.com/150',
            followers: 1250,
            isFollowing: false,
            mutualFriends: 5
          },
          {
            id: 'user2',
            username: 'vinylcollector',
            displayName: 'Sarah Chen',
            profilePicture: 'https://via.placeholder.com/150',
            followers: 890,
            isFollowing: true,
            mutualFriends: 3
          }
        ]
      };

      setSearchResults(mockResults);
      
      // Add to recent searches
      if (query.trim()) {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        const updatedRecent = [query, ...recent.filter(item => item !== query)].slice(0, 10);
        localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));
        setRecentSearches(updatedRecent);
      }

    } catch (err) {
      console.error('Error performing search:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    console.log('Playing track:', track.title);
    // Implement Spotify playback
  };

  const handleFollowUser = (userId) => {
    setSearchResults(prev => ({
      ...prev,
      users: prev.users.map(user => 
        user.id === userId 
          ? { ...user, isFollowing: !user.isFollowing }
          : user
      )
    }));
  };

  const handleFollowArtist = (artistId) => {
    console.log('Following artist:', artistId);
    // Implement artist follow functionality
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
    setRecentSearches([]);
  };

  const getTotalResults = () => {
    return searchResults.tracks.length + 
           searchResults.artists.length + 
           searchResults.playlists.length + 
           searchResults.users.length;
  };

  const renderTracks = () => (
    <div className="tracks-results">
      <h3>Tracks ({searchResults.tracks.length})</h3>
      <div className="tracks-list">
        {searchResults.tracks.map((track) => (
          <div key={track.id} className="track-item glassmorphism">
            <img src={track.albumArt} alt={track.title} className="track-image" />
            <div className="track-info">
              <h4 className="track-title">{track.title}</h4>
              <p className="track-artist">{track.artist}</p>
              <p className="track-album">{track.album}</p>
            </div>
            <div className="track-meta">
              <span className="duration">{track.duration}</span>
              <span className="popularity">🔥 {track.popularity}%</span>
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

  const renderArtists = () => (
    <div className="artists-results">
      <h3>Artists ({searchResults.artists.length})</h3>
      <div className="artists-grid">
        {searchResults.artists.map((artist) => (
          <div key={artist.id} className="artist-card glassmorphism">
            <img src={artist.image} alt={artist.name} className="artist-image" />
            <div className="artist-info">
              <h4 className="artist-name">{artist.name}</h4>
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
              className="follow-btn"
              onClick={() => handleFollowArtist(artist.id)}
            >
              Follow
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlaylists = () => (
    <div className="playlists-results">
      <h3>Playlists ({searchResults.playlists.length})</h3>
      <div className="playlists-grid">
        {searchResults.playlists.map((playlist) => (
          <div key={playlist.id} className="playlist-card glassmorphism">
            <img src={playlist.image} alt={playlist.name} className="playlist-image" />
            <div className="playlist-info">
              <h4 className="playlist-name">{playlist.name}</h4>
              <p className="playlist-description">{playlist.description}</p>
              <div className="playlist-meta">
                <span className="tracks-count">{playlist.tracksCount} tracks</span>
                <span className="playlist-owner">by {playlist.owner}</span>
              </div>
            </div>
            <button className="play-btn">▶️</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="users-results">
      <h3>Users ({searchResults.users.length})</h3>
      <div className="users-grid">
        {searchResults.users.map((user) => (
          <div key={user.id} className="user-card glassmorphism">
            <img src={user.profilePicture} alt={user.displayName} className="user-avatar" />
            <div className="user-info">
              <h4 className="user-name">{user.displayName}</h4>
              <p className="user-username">@{user.username}</p>
              <div className="user-meta">
                <span className="followers">{user.followers} followers</span>
                <span className="mutual-friends">{user.mutualFriends} mutual friends</span>
              </div>
            </div>
            <button 
              className={`follow-btn ${user.isFollowing ? 'following' : ''}`}
              onClick={() => handleFollowUser(user.id)}
            >
              {user.isFollowing ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSearchResults = () => {
    if (loading) {
      return (
        <div className="search-loading">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="search-error">
          <h3>Search Error</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (!searchQuery.trim()) {
      return (
        <div className="search-suggestions">
          <div className="recent-searches">
            <div className="suggestions-header">
              <h3>Recent Searches</h3>
              {recentSearches.length > 0 && (
                <button onClick={clearRecentSearches} className="clear-btn">Clear</button>
              )}
            </div>
            <div className="suggestions-list">
              {recentSearches.length > 0 ? (
                recentSearches.map((search, index) => (
                  <button
                    key={index}
                    className="suggestion-item"
                    onClick={() => setSearchQuery(search)}
                  >
                    🔍 {search}
                  </button>
                ))
              ) : (
                <p className="no-recent">No recent searches</p>
              )}
            </div>
          </div>

          <div className="trending-searches">
            <h3>Trending Searches</h3>
            <div className="trending-tags">
              {trendingSearches.map((trend, index) => (
                <button
                  key={index}
                  className="trending-tag"
                  onClick={() => setSearchQuery(trend)}
                >
                  🔥 {trend}
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    const totalResults = getTotalResults();
    if (totalResults === 0) {
      return (
        <div className="no-results">
          <h3>No results found</h3>
          <p>Try searching for something else</p>
        </div>
      );
    }

    return (
      <div className="search-results">
        <div className="results-header">
          <h3>Search Results ({totalResults})</h3>
          <p>Found {totalResults} results for "{searchQuery}"</p>
        </div>

        {activeTab === 'all' && (
          <div className="all-results">
            {searchResults.tracks.length > 0 && renderTracks()}
            {searchResults.artists.length > 0 && renderArtists()}
            {searchResults.playlists.length > 0 && renderPlaylists()}
            {searchResults.users.length > 0 && renderUsers()}
          </div>
        )}

        {activeTab === 'tracks' && renderTracks()}
        {activeTab === 'artists' && renderArtists()}
        {activeTab === 'playlists' && renderPlaylists()}
        {activeTab === 'users' && renderUsers()}
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Search</h1>
        <p>Find music, artists, playlists, and friends</p>
      </div>

      <div className="search-container">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search for music, artists, playlists, or users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            autoFocus
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {searchQuery.trim() && (
        <div className="search-tabs">
          <button 
            className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All ({getTotalResults()})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'tracks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracks')}
          >
            Tracks ({searchResults.tracks.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Artists ({searchResults.artists.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists ({searchResults.playlists.length})
          </button>
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users ({searchResults.users.length})
          </button>
        </div>
      )}

      <div className="search-content">
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default SearchPage;


