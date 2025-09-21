import React, { useEffect, useState } from "react";
import "./vibePage.css";
import { Icon } from '@iconify/react';
import SpotifyTrack from '../syncMusic/spotifyTrack';
import { getSpotifyToken } from "./spotfiyToken";
import { getPlaylists } from "./getUsersPlaylist";
import { getUserId } from "./getUserId";
import ParentComponent from "./playbackParent";
import SpotifyPlaylists from "./usersPlaylist";
import MusicPostForm from "./musicPostForm";
import Dashboard from "./dashboard";
import Content from "./content";
import Sidebar from "./sideBar";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../contexts/UserProfileContext";
import UserProfile from "./UserProfile";
import DiscoverPage from "./discoverPage";
import LibraryPage from "./libraryPage";
import FriendsPage from "./friendsPage";
import SearchPage from "./searchPage";
import NotificationsPage from "./notificationsPage";
import SettingsPage from "./settingsPage";
import MusicPlayer from "./musicPlayer";

const VibePage = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  
  // Music player state
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  
  // Navigation state - keeping your original structure
  const [currentPage, setCurrentPage] = useState('home');
  
  // Authentication
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-circle') && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Fetch posts directly in this component
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://us-central1-mapbot-9a988.cloudfunctions.net/getMusicFeed');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load music feed');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refreshFeed]);

  // Load default track "No Time Wasted" on component mount
  useEffect(() => {
    const loadDefaultTrack = async () => {
      try {
        setIsPlayerLoading(true);
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
          console.error('Spotify credentials not found');
          return;
        }

        // Get Spotify token
        const token = await getSpotifyToken(clientId, clientSecret);
        
        // Fetch "No Time Wasted" track
        const trackId = "4MUlNqSrMeFAHA6VpJKMo8"; // No Time Wasted track ID
        const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (trackResponse.ok) {
          const trackData = await trackResponse.json();
          setCurrentTrack(trackData);
          console.log('Loaded track:', trackData.name);
        } else {
          console.error('Failed to fetch track:', trackResponse.statusText);
        }
      } catch (error) {
        console.error('Error loading default track:', error);
      } finally {
        setIsPlayerLoading(false);
      }
    };

    loadDefaultTrack();
  }, []);

  const handlePostSubmit = () => {
    setShowPostForm(false);
    setRefreshFeed(prev => !prev); // Trigger feed refresh
  };

  // Navigation click handlers
  const handleNavigationClick = (page) => {
    setCurrentPage(page);
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  // Profile handlers
  const handleProfileClick = () => {
    setSelectedUserId(user?.userId);
    setShowUserProfile(true);
    setShowProfileMenu(false);
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
    setShowUserProfile(true);
  };

  const handleCloseProfile = () => {
    setShowUserProfile(false);
    setSelectedUserId(null);
  };

  // Function to play a track from the feed
  const handlePlayTrack = async (trackId) => {
    try {
      setIsPlayerLoading(true);
      const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
      const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        console.error('Spotify credentials not found');
        return;
      }

      // Get Spotify token
      const token = await getSpotifyToken(clientId, clientSecret);
      
      // Fetch track data
      const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (trackResponse.ok) {
        const trackData = await trackResponse.json();
        setCurrentTrack(trackData);
        console.log('Now playing:', trackData.name);
      } else {
        console.error('Failed to fetch track:', trackResponse.statusText);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    } finally {
      setIsPlayerLoading(false);
    }
  };

  // Render different components based on current page - combining both approaches
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="feed-container">
            <div className="posts-feed">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading vibes...</p>
                </div>
              ) : error ? (
                <div className="error-state">
                  <Icon icon="material-symbols:error-outline" className="error-icon" />
                  <p>{error}</p>
                  <button onClick={() => setRefreshFeed(prev => !prev)} className="retry-btn">
                    Try Again
                  </button>
                </div>
              ) : posts.length === 0 ? (
                <div className="empty-state">
                  <Icon icon="material-symbols:music-note" className="empty-icon" />
                  <h3>No vibes yet</h3>
                  <p>Be the first to share your music!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <div className="post-header">
                      <div className="post-user" onClick={() => handleUserClick(post.userId)}>
                        <div className="user-avatar">
                          <Icon icon="material-symbols:account-circle" />
                        </div>
                        <div className="user-info">
                          <span className="username">{post.userId}</span>
                          <span className="post-time">{formatTimestamp(post.timestamp)}</span>
                        </div>
                      </div>
                      <div className="post-type-badge">
                        <Icon icon={getTypeIcon(post.type)} />
                        <span>{post.type}</span>
                      </div>
                    </div>
                    
                    <div className="post-content">
                      <div className="spotify-item">
                        <Icon icon="simple-icons:spotify" className="spotify-icon" />
                        <span className="spotify-id">{post.id}</span>
                      </div>
                      <p className="post-note">{post.note}</p>
                    </div>
                    
                    <div className="post-actions">
                      <button 
                        className="action-btn play-btn" 
                        onClick={() => handlePlayTrack(post.id)}
                        disabled={isPlayerLoading}
                      >
                        <Icon icon="material-symbols:play-arrow" />
                        <span>{isPlayerLoading ? 'Loading...' : 'Play'}</span>
                      </button>
                      <button className="action-btn">
                        <Icon icon="material-symbols:favorite-outline" />
                        <span>Like</span>
                      </button>
                      <button className="action-btn">
                        <Icon icon="material-symbols:chat-bubble-outline" />
                        <span>Comment</span>
                      </button>
                      <button className="action-btn">
                        <Icon icon="material-symbols:share" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      case 'discover':
        return <DiscoverPage />;
      case 'library':
        return <LibraryPage />;
      case 'friends':
        return <FriendsPage />;
      case 'search':
        return <SearchPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
        return <Dashboard />;
      default:
        return <div>Page not found</div>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'track':
        return 'material-symbols:music-note';
      case 'artist':
        return 'material-symbols:person';
      case 'playlist':
        return 'material-symbols:queue-music';
      default:
        return 'material-symbols:music-note';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="vibe-page">
      {/* Header - Your original design with modern touches */}
      <div className="vibe-header">
        <div className="header-left">
          <Icon
            icon="mdi:cosine-wave"
            className="header-icon"
          />
          <span className="brand-name">Vibetune</span>
          {currentTrack && (
            <div className="current-track-info">
              <Icon icon="material-symbols:music-note" className="track-icon" />
              <span className="track-name">{currentTrack.name}</span>
            </div>
          )}
        </div>
        
        <div className="header-right">
          <button 
            className="play-now-btn"
            onClick={() => currentTrack && handlePlayTrack(currentTrack.id)}
            disabled={!currentTrack || isPlayerLoading}
          >
            <Icon icon="material-symbols:play-arrow" />
            <span>{isPlayerLoading ? 'Loading...' : 'Play Now'}</span>
          </button>
          
          <div className="profile-circle" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <span className="profile-text">{user?.userId?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-item" onClick={handleProfileClick}>
                <Icon icon="material-symbols:person" />
                <span>Profile</span>
              </div>
              <div className="profile-menu-item" onClick={handleLogout}>
                <Icon icon="material-symbols:logout" />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Page Content */}
      {renderCurrentPage()}

      {/* Music Player Card - Fixed at bottom */}
      <div className="music-player-card-bottom">
        <MusicPlayer trackData={currentTrack} />
      </div>

      {/* Navigation Bar - Fixed at bottom with modern icons */}
      <div className="nav-bar-bottom">
        <Icon 
          icon="material-symbols:home-rounded" 
          className={`nav-icon ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('home')}
        />
        <Icon 
          icon="material-symbols:explore-rounded" 
          className={`nav-icon ${currentPage === 'discover' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('discover')}
        />
        <Icon 
          icon="material-symbols:search-rounded" 
          className={`nav-icon ${currentPage === 'search' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('search')}
        />
        <Icon 
          icon="material-symbols:library-music-rounded" 
          className={`nav-icon ${currentPage === 'library' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('library')}
        />
        <Icon 
          icon="material-symbols:group-rounded" 
          className={`nav-icon ${currentPage === 'friends' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('friends')}
        />
      </div>

      {/* Subtle Post Button - Instagram Style */}
      <div className="post-button" onClick={() => setShowPostForm(true)}>
        <Icon icon="material-symbols:add" />
      </div>

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="modal-overlay" onClick={() => setShowPostForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Share Your Vibe</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowPostForm(false)}
              >
                <Icon icon="material-symbols:close" />
              </button>
            </div>
            <MusicPostForm onPostSubmit={handlePostSubmit} />
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showUserProfile && selectedUserId && (
        <UserProfile 
          userId={selectedUserId}
          onClose={handleCloseProfile}
          isOwnProfile={selectedUserId === user?.userId}
        />
      )}

    </div>
  );
};

export default VibePage;