import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUserProfile } from "../../contexts/UserProfileContext";
import MusicPostFeed from "./musicPostFeed";
import MusicPostForm from "./musicPostForm";
import EnhancedMusicPlayer from "./EnhancedMusicPlayer";
import DiscoverPage from "./discoverPage";
import LibraryPage from "./libraryPage";
import FriendsPage from "./friendsPage";
import SearchPage from "./searchPage";
import NotificationsPage from "./notificationsPage";
import SettingsPage from "./settingsPage";
import "./vibePage.css";

const VibePage = () => {
  const { user, logout } = useAuth();
  const { userProfile } = useUserProfile();
  
  // State management
  const [activeTab, setActiveTab] = useState('feed');
  const [showPostForm, setShowPostForm] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Mock data for demonstration
  const [feedPosts, setFeedPosts] = useState([
    {
      id: 1,
      user: {
        id: 'user1',
        name: 'Alex Chen',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        verified: true
      },
      track: {
        id: 'track1',
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 200000,
        preview_url: 'https://p.scdn.co/mp3-preview/example1.mp3'
      },
      caption: 'This song hits different at 2 AM 🎵',
      timestamp: new Date(Date.now() - 3600000),
      likes: 42,
      comments: 8,
      isLiked: false,
      spotifyUrl: 'https://open.spotify.com/track/0VjIjW4UAa4X6jCq5qjIcf'
    },
    {
      id: 2,
      user: {
        id: 'user2',
        name: 'Sarah Johnson',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        verified: false
      },
      track: {
        id: 'track2',
        name: 'Levitating',
        artist: 'Dua Lipa',
        album: 'Future Nostalgia',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 203000,
        preview_url: 'https://p.scdn.co/mp3-preview/example2.mp3'
      },
      caption: 'Perfect for my morning workout! 💪',
      timestamp: new Date(Date.now() - 7200000),
      likes: 28,
      comments: 5,
      isLiked: true,
      spotifyUrl: 'https://open.spotify.com/track/463CkQjx2Zf1y3u0htLzaL'
    },
    {
      id: 3,
      user: {
        id: 'user3',
        name: 'Mike Rodriguez',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        verified: true
      },
      track: {
        id: 'track3',
        name: 'Good 4 U',
        artist: 'Olivia Rodrigo',
        album: 'SOUR',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
        duration: 178000,
        preview_url: 'https://p.scdn.co/mp3-preview/example3.mp3'
      },
      caption: 'This song perfectly captures my mood today 😤',
      timestamp: new Date(Date.now() - 10800000),
      likes: 67,
      comments: 12,
      isLiked: false,
      spotifyUrl: 'https://open.spotify.com/track/4ZtFanR9U6ndgddUvNcjcG'
    }
  ]);

  const [discoverTracks, setDiscoverTracks] = useState([
    {
      id: 'discover1',
      name: 'Industry Baby',
      artist: 'Lil Nas X',
      album: 'MONTERO',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 212000,
      preview_url: 'https://p.scdn.co/mp3-preview/discover1.mp3',
      spotifyUrl: 'https://open.spotify.com/track/27NovPIUIRrOZoCHxABJwK'
    },
    {
      id: 'discover2',
      name: 'Stay',
      artist: 'The Kid LAROI & Justin Bieber',
      album: 'F*CK LOVE 3: OVER YOU',
      image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36',
      duration: 141000,
      preview_url: 'https://p.scdn.co/mp3-preview/discover2.mp3',
      spotifyUrl: 'https://open.spotify.com/track/5PjdY0CKGZdEuoNab3yDmX'
    }
  ]);

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setShowPlayer(true);
  };

  const handleLikePost = (postId) => {
    setFeedPosts(posts => 
      posts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const handleAddPost = (newPost) => {
    setFeedPosts(posts => [newPost, ...posts]);
    setShowPostForm(false);
  };

  const handleLogout = () => {
    logout();
    setShowProfileMenu(false);
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: '🏠' },
    { id: 'discover', label: 'Discover', icon: '🔍' },
    { id: 'library', label: 'Library', icon: '📚' },
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <MusicPostFeed 
            posts={feedPosts}
            onLike={handleLikePost}
            onPlay={handlePlayTrack}
            onRefresh={() => setFeedPosts([...feedPosts])}
          />
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
      
      default:
        return null;
    }
  };

  return (
    <div className="vibe-page">
      {/* Header */}
      <header className="vibe-header">
        <div className="header-left">
          <h1 className="app-title">🎵 Vibetune</h1>
        </div>
        
        <div className="header-center">
          <div className="tab-navigation">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="header-right">
          <button 
            className="add-post-button"
            onClick={() => setShowPostForm(true)}
          >
            ➕ Share Music
          </button>
          
          <div className="profile-section">
            <img 
              src={userProfile?.profilePicture || 'https://randomuser.me/api/portraits/men/6.jpg'} 
              alt="Profile" 
              className="profile-avatar"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-info">
                  <h3>{userProfile?.displayName || 'User'}</h3>
                  <p>{userProfile?.email || 'user@example.com'}</p>
                </div>
                <div className="profile-actions">
                  <button onClick={() => {/* Navigate to profile */}}>
                    👤 View Profile
                  </button>
                  <button onClick={() => {/* Navigate to settings */}}>
                    ⚙️ Settings
                  </button>
                  <button onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="vibe-main">
        {renderTabContent()}
      </main>

      {/* Music Player */}
      {showPlayer && currentTrack && (
        <EnhancedMusicPlayer 
          track={currentTrack}
          onClose={() => setShowPlayer(false)}
        />
      )}

      {/* Post Form Modal */}
      {showPostForm && (
        <div className="modal-overlay">
          <MusicPostForm 
            onSubmit={handleAddPost}
            onCancel={() => setShowPostForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default VibePage;