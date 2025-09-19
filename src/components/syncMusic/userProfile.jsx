import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './userProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth();
  const { userProfile, updateUserProfile } = useUserProfile();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: '',
    musicGenres: [],
    musicMood: '',
    privacySettings: {
      showListeningActivity: true,
      allowFriendRequests: true,
      showTopTracks: true
    }
  });

  const [stats, setStats] = useState({
    totalPosts: 47,
    totalLikes: 234,
    followers: 89,
    following: 156,
    topGenres: ['Pop', 'Hip-Hop', 'Electronic'],
    topArtists: ['The Weeknd', 'Dua Lipa', 'Olivia Rodrigo'],
    recentActivity: [
      { type: 'post', content: 'Shared "Blinding Lights" by The Weeknd', time: '2 hours ago' },
      { type: 'like', content: 'Liked "Levitating" by Dua Lipa', time: '5 hours ago' },
      { type: 'follow', content: 'Started following @musiclover23', time: '1 day ago' }
    ]
  });

  const [recentPosts, setRecentPosts] = useState([
    {
      id: 1,
      track: {
        name: 'Blinding Lights',
        artist: 'The Weeknd',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
      },
      caption: 'This song hits different at 2 AM 🎵',
      likes: 42,
      timestamp: new Date(Date.now() - 3600000)
    },
    {
      id: 2,
      track: {
        name: 'Levitating',
        artist: 'Dua Lipa',
        image: 'https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36'
      },
      caption: 'Perfect for my morning workout! 💪',
      likes: 28,
      timestamp: new Date(Date.now() - 7200000)
    }
  ]);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || '',
        musicGenres: userProfile.musicGenres || [],
        musicMood: userProfile.musicMood || '',
        privacySettings: userProfile.privacySettings || {
          showListeningActivity: true,
          allowFriendRequests: true,
          showTopTracks: true
        }
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (setting) => {
    setEditForm(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: !prev.privacySettings[setting]
      }
    }));
  };

  const handleSave = async () => {
    try {
      const success = await updateUserProfile(editForm);
      if (success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'posts', label: 'Posts', icon: '🎵' },
    { id: 'activity', label: 'Activity', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const renderOverview = () => (
    <div className="overview-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Posts</h3>
          <p>{stats.totalPosts}</p>
        </div>
        <div className="stat-card">
          <h3>Likes</h3>
          <p>{stats.totalLikes}</p>
        </div>
        <div className="stat-card">
          <h3>Followers</h3>
          <p>{stats.followers}</p>
        </div>
        <div className="stat-card">
          <h3>Following</h3>
          <p>{stats.following}</p>
        </div>
      </div>

      <div className="music-taste">
        <h3>Music Taste</h3>
        <div className="taste-section">
          <div className="top-genres">
            <h4>Top Genres</h4>
            <div className="genre-tags">
              {stats.topGenres.map(genre => (
                <span key={genre} className="genre-tag">{genre}</span>
              ))}
            </div>
          </div>
          <div className="top-artists">
            <h4>Top Artists</h4>
            <div className="artist-list">
              {stats.topArtists.map(artist => (
                <div key={artist} className="artist-item">
                  <span className="artist-name">{artist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPosts = () => (
    <div className="posts-content">
      <h3>Recent Posts</h3>
      <div className="posts-grid">
        {recentPosts.map(post => (
          <div key={post.id} className="post-card">
            <img src={post.track.image} alt={post.track.name} className="post-image" />
            <div className="post-info">
              <h4>{post.track.name}</h4>
              <p>{post.track.artist}</p>
              <p className="post-caption">{post.caption}</p>
              <div className="post-stats">
                <span>❤️ {post.likes}</span>
                <span>{formatTimeAgo(post.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderActivity = () => (
    <div className="activity-content">
      <h3>Recent Activity</h3>
      <div className="activity-feed">
        {stats.recentActivity.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-icon">
              {activity.type === 'post' ? '🎵' : activity.type === 'like' ? '❤️' : '👥'}
            </div>
            <div className="activity-content">
              <p>{activity.content}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="settings-content">
      <h3>Profile Settings</h3>
      
      {!isEditing ? (
        <div className="profile-info">
          <div className="info-item">
            <label>Display Name</label>
            <p>{userProfile?.displayName || 'Not set'}</p>
          </div>
          <div className="info-item">
            <label>Bio</label>
            <p>{userProfile?.bio || 'No bio yet'}</p>
          </div>
          <div className="info-item">
            <label>Music Mood</label>
            <p>{userProfile?.musicMood || 'Not set'}</p>
          </div>
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </button>
        </div>
      ) : (
        <div className="edit-form">
          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={editForm.displayName}
              onChange={handleInputChange}
              placeholder="Enter your display name"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={editForm.bio}
              onChange={handleInputChange}
              placeholder="Tell us about your music taste..."
              rows="3"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="musicMood">Music Mood</label>
            <input
              type="text"
              id="musicMood"
              name="musicMood"
              value={editForm.musicMood}
              onChange={handleInputChange}
              placeholder="e.g., Energetic, Chill, Romantic"
            />
          </div>
          
          <div className="privacy-settings">
            <h4>Privacy Settings</h4>
            <div className="privacy-option">
              <label>
                <input
                  type="checkbox"
                  checked={editForm.privacySettings.showListeningActivity}
                  onChange={() => handlePrivacyChange('showListeningActivity')}
                />
                <span>Show listening activity</span>
              </label>
            </div>
            <div className="privacy-option">
              <label>
                <input
                  type="checkbox"
                  checked={editForm.privacySettings.allowFriendRequests}
                  onChange={() => handlePrivacyChange('allowFriendRequests')}
                />
                <span>Allow friend requests</span>
              </label>
            </div>
            <div className="privacy-option">
              <label>
                <input
                  type="checkbox"
                  checked={editForm.privacySettings.showTopTracks}
                  onChange={() => handlePrivacyChange('showTopTracks')}
                />
                <span>Show top tracks</span>
              </label>
            </div>
          </div>
          
          <div className="form-actions">
            <button className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
            <button className="save-button" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        </div>
      )}
      
      <div className="danger-zone">
        <h4>Danger Zone</h4>
        <button className="logout-button" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'posts':
        return renderPosts();
      case 'activity':
        return renderActivity();
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-header">
        <div className="profile-avatar-section">
          <img 
            src={userProfile?.profilePicture || 'https://randomuser.me/api/portraits/men/6.jpg'} 
            alt="Profile" 
            className="profile-avatar"
          />
          <div className="profile-info">
            <h1>{userProfile?.displayName || 'User'}</h1>
            <p>{userProfile?.email || 'user@example.com'}</p>
            {userProfile?.bio && <p className="bio">{userProfile.bio}</p>}
          </div>
        </div>
      </div>

      <div className="profile-tabs">
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

      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserProfile;