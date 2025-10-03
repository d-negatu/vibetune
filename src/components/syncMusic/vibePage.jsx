import React, { useEffect, useState } from "react";
import "./vibePage.css";
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import SpotifyTrack from './spotifyTrack';
import { getSpotifyToken } from "./spotfiyToken";
import { getPlaylists } from "./getUsersPlaylist";
import { getUserId } from "./getUserId";
import ParentComponent from "./playbackParent";
import MusicPlayer from "./musicPlayer";
import SpotifyPlaylists from "./usersPlaylist";
import MusicPostForm from "./musicPostForm";
import Dashboard from "./dashboard";
import Content from "./content";
import Sidebar from "./sideBar";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../contexts/UserProfileContext";
import UserProfile from "./userProfile";

const VibePage = () => {
  const navigate = useNavigate();
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
  const [audioElement, setAudioElement] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Spotify Web Playback SDK state
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [isWebPlaybackReady, setIsWebPlaybackReady] = useState(false);
  const [playbackMode, setPlaybackMode] = useState('unknown'); // 'webplayback', 'preview', 'demo'
  
  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    const initializeSpotifyPlayer = async () => {
      try {
        const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
        
        if (!clientId || !clientSecret) {
          console.log('Spotify credentials not found, skipping Web Playback');
          return;
        }

        // Get Spotify token
        const token = await getSpotifyToken(clientId, clientSecret);
        console.log('Token obtained for Web Playback:', token ? 'YES' : 'NO');

        // Load Spotify Web Playback SDK
        if (!window.Spotify) {
          const script = document.createElement('script');
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          document.body.appendChild(script);

          script.onload = () => {
            window.onSpotifyWebPlaybackSDKReady = () => {
              const player = new window.Spotify.Player({
                name: 'Vibetune Player',
                getOAuthToken: cb => cb(token),
                volume: 0.5
              });

              // Player ready
              player.addListener('ready', ({ device_id }) => {
                console.log('Spotify Web Playback Ready with Device ID:', device_id);
                setSpotifyPlayer(player);
                setIsWebPlaybackReady(true);
                setPlaybackMode('webplayback');
              });

              // Player not ready
              player.addListener('not_ready', ({ device_id }) => {
                console.log('Spotify Web Playback not ready:', device_id);
                setIsWebPlaybackReady(false);
              });

              // Player state changed
              player.addListener('player_state_changed', (state) => {
                if (!state) return;
                setIsPlaying(!state.paused);
              });

              // Error handlers
              player.addListener('initialization_error', ({ message }) => {
                console.error('Spotify Web Playback initialization error:', message);
                setIsWebPlaybackReady(false);
              });

              player.addListener('authentication_error', ({ message }) => {
                console.error('Spotify Web Playback auth error:', message);
                setIsWebPlaybackReady(false);
              });

              player.connect();
            };
          };
        }
      } catch (error) {
        console.error('Error initializing Spotify Web Playback:', error);
        setIsWebPlaybackReady(false);
      }
    };

    initializeSpotifyPlayer();
  }, []);

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
        console.log('Token obtained:', token ? 'YES' : 'NO');
        
        // Try multiple popular songs to find one with preview URL
        const searchQueries = ["blinding lights", "watermelon sugar", "good 4 u", "drivers license"];
        
        let selectedTrack = null;
        for (const searchQuery of searchQueries) {
          console.log(`Trying search: ${searchQuery}`);
          
          try {
            const searchResponse = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (searchResponse.ok) {
              const searchData = await searchResponse.json();
              
              // Check each track for preview URL
              if (searchData.tracks?.items) {
                for (const track of searchData.tracks.items) {
                  console.log(`Checking ${searchQuery}: ${track.name} - Preview URL: ${track.preview_url ? 'YES' : 'NO'}`);
                  if (track.preview_url) {
                    selectedTrack = track;
                    console.log(`Found track with preview: ${track.name}`);
                    break;
                  }
                }
              }
              
              if (selectedTrack) break; // Stop searching once we found one
            }
          } catch (error) {
            console.log(`Error searching for ${searchQuery}:`, error.message);
          }
        }

        // If no track with preview found in search, try a guaranteed track ID that has preview
        if (!selectedTrack) {
          console.log('No tracks with preview found in search, trying guaranteed track...');
          const guaranteedTrackId = "4uLU6hMCjMI75M1A2tKUQC"; // As It Was - Harry Styles
          const guaranteedResponse = await fetch(`https://api.spotify.com/v1/tracks/${guaranteedTrackId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (guaranteedResponse.ok) {
            const guaranteedTrack = await guaranteedResponse.json();
            console.log(`Guaranteed track: ${guaranteedTrack.name} - Preview URL: ${guaranteedTrack.preview_url ? 'YES' : 'NO'}`);
            if (guaranteedTrack.preview_url) {
              selectedTrack = guaranteedTrack;
            } else {
              // Load the track anyway so user sees something
              selectedTrack = guaranteedTrack;
            }
          } else {
            console.log(`Guaranteed track failed with status: ${guaranteedResponse.status}`);
          }
        }

        if (selectedTrack) {
          setCurrentTrack(selectedTrack);
          console.log('Loaded track:', selectedTrack.name, '- Preview:', selectedTrack.preview_url ? 'YES' : 'NO');
        } else {
          console.log('No tracks with preview found, creating demo track...');
          // Create a demo track object for testing
          const demoTrack = {
            id: "demo_track",
            name: "Demo Track (No Preview)",
            artists: [{ name: "Demo Artist" }],
            album: {
              images: [{ url: "https://via.placeholder.com/300x300/8B5CF6/FFFFFF?text=🎵" }]
            },
            preview_url: null
          };
          setCurrentTrack(demoTrack);
        }

        // The track loading logic is now above in the search/guaranteed track section
      } catch (error) {
        console.error('Error loading default track:', error);
      } finally {
        setIsPlayerLoading(false);
      }
    };

    loadDefaultTrack();
  }, []);
  
  // Navigation state
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

  // Hybrid playback strategy: Spotify Premium → Preview Fallback
  const togglePlay = async () => {
    if (!currentTrack) return;
    
    try {
      // Strategy 1: Try Spotify Web Playback SDK (Premium full tracks)
      if (isWebPlaybackReady && spotifyPlayer) {
        console.log('🎧 Attempting Spotify Premium Web Playback...');
        setPlaybackMode('webplayback');
        
        try {
          const token = await getSpotifyToken(import.meta.env.VITE_SPOTIFY_CLIENT_ID, import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET);
          
          const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              uris: [`spotify:track:${currentTrack.id}`]
            })
          });
          
          if (response.ok) {
            console.log('✅ Spotify Premium Web Playback successful - playing full track');
            setIsPlaying(true);
            return;
          } else {
            console.log('❌ Spotify Premium failed (likely not Premium user), falling back to preview...');
            // Don't return here, continue to preview fallback
          }
        } catch (error) {
          console.log('❌ Spotify Premium Web Playback error, falling back to preview...', error);
          // Don't return here, continue to preview fallback
        }
      } else {
        console.log('🎵 Spotify Web Playback not ready, using preview fallback...');
        setPlaybackMode('preview');
      }
      
      // Strategy 2: Fall back to preview URLs (30-second clips)
      if (currentTrack.preview_url) {
        console.log('🎵 Using preview URL fallback (30-second clip)');
        setPlaybackMode('preview');
        
        if (!audioElement) {
          const audio = new Audio(currentTrack.preview_url);
          audio.addEventListener('ended', () => setIsPlaying(false));
          setAudioElement(audio);
          audio.play();
          setIsPlaying(true);
        } else {
          if (isPlaying) {
            audioElement.pause();
            setIsPlaying(false);
          } else {
            audioElement.play();
            setIsPlaying(true);
          }
        }
        return;
      }
      
      // Strategy 3: Demo mode (visual feedback only) - only if no preview available
      console.log('🎭 No preview available - using demo mode');
      setPlaybackMode('demo');
      setIsPlaying(true);
      
      setTimeout(() => {
        setIsPlaying(false);
        alert(`🎵 Demo Mode\n\n"${currentTrack.name}" by ${currentTrack.artists?.map(a => a.name).join(', ')}\n\nNo audio preview available for this track.\n\nTry Spotify Premium for full track playback!`);
      }, 2000);
      
    } catch (error) {
      console.error('Error in hybrid playback:', error);
      // Fallback to demo mode
      setPlaybackMode('demo');
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 2000);
    }
  };

  // Mute/unmute functionality
  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
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
                      <button className="action-btn">
                        <Icon icon="material-symbols:play-arrow" />
                        <span>Play</span>
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
          <button 
            className="test-webplayback-btn"
            onClick={() => navigate('/test-webplayback')}
            title="Test Spotify Web Playback SDK"
          >
            🎧 Test Player
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
        {isPlayerLoading ? (
          <div className="player-loading">
            <div className="loading-spinner"></div>
            <p>Loading track...</p>
          </div>
        ) : currentTrack ? (
          <div className="simple-player">
            <div className="track-info-clickable" onClick={togglePlay}>
              <img 
                src={currentTrack.album?.images?.[0]?.url || '/default-album-art.jpg'} 
                alt="Track Art" 
                className="track-art"
              />
              <div className="track-details">
                <h4 className="track-name">{currentTrack.name}</h4>
                <p className="artist-name">{currentTrack.artists?.map(artist => artist.name).join(", ")}</p>
                <div className="playback-mode-indicators">
                  {playbackMode === 'webplayback' && (
                    <span className="mode-badge webplayback-badge">🎧 Spotify Premium</span>
                  )}
                  {playbackMode === 'preview' && (
                    <span className="mode-badge preview-badge">🎵 Preview (30s)</span>
                  )}
                  {playbackMode === 'demo' && (
                    <span className="mode-badge demo-badge">🎭 Demo Mode</span>
                  )}
                </div>
              </div>
            </div>
            <div className="player-controls">
              <button className="control-btn play-btn" onClick={togglePlay}>
                <Icon icon={isPlaying ? "material-symbols:pause" : "material-symbols:play-arrow"} />
              </button>
              <button className="control-btn mute-btn" onClick={toggleMute}>
                <Icon icon={isMuted ? "material-symbols:volume-off" : "material-symbols:volume-up"} />
              </button>
            </div>
          </div>
        ) : (
          <div className="no-track">
            <Icon icon="material-symbols:music-note" />
            <p>No track loaded</p>
          </div>
        )}
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