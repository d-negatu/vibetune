import React, { useEffect, useState } from "react";
import "./vibePage.css";
import { Icon } from '@iconify/react';
import SpotifyTrack from '../syncMusic/spotifyTrack';
import { getSpotifyToken } from "./spotfiyToken";
import { getPlaylists } from "./getUsersPlaylist";
import { getUserId } from "./getUserId";
import MusicPlayer from "./musicPlayer";
import SpotifyPlaylists from "./usersPlaylist";
import ParentComponent from "./playbackParent";
import MusicPostForm from "./musicPostForm";
import Dashboard from "./dashboard";
import Content from "./content";
import Sidebar from "./sideBar";
import { useAuth } from "../../contexts/AuthContext";

const VibePage = () => {
  const [showPostForm, setShowPostForm] = useState(false);
  const [refreshFeed, setRefreshFeed] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  
  // Authentication
  const { user, logout } = useAuth();

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

  // Render different components based on current page
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
                      <div className="post-user">
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
      case 'search':
        return (
          <div className="page-content">
            <h2>Search</h2>
            <p>Search for music, artists, and playlists</p>
            {/* Add search functionality here */}
          </div>
        );
      case 'library':
        return <Content />;
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
      {/* Header */}
      <div className="vibe-header">
        <div className="header-left">
          <Icon
            icon="mdi:cosine-wave"
            className="header-icon"
          />
          <span className="brand-name">ibetune</span>
        </div>
        
        <div className="header-right">
          <div className="profile-circle" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <span className="profile-text">{user?.userId?.charAt(0)?.toUpperCase() || 'U'}</span>
          </div>
          
          {showProfileMenu && (
            <div className="profile-menu">
              <div className="profile-menu-item">
                <Icon icon="material-symbols:person" />
                <span>{user?.userId || 'User'}</span>
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
        <ParentComponent/>
      </div>

      {/* Navigation Bar - Fixed at bottom */}
      <div className="nav-bar-bottom">
        <Icon 
          icon="material-symbols:home-rounded" 
          className={`nav-icon ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('home')}
        />
        <Icon 
          icon="material-symbols:search-rounded" 
          className={`nav-icon ${currentPage === 'search' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('search')}
        />
        <Icon 
          icon="foundation:social-treehouse" 
          className={`nav-icon ${currentPage === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('dashboard')}
        />
        <Icon 
          icon="fluent:library-20-filled" 
          className={`nav-icon ${currentPage === 'library' ? 'active' : ''}`}
          onClick={() => handleNavigationClick('library')}
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

    </div>
  );
};

export default VibePage;