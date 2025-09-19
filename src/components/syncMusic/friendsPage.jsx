import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './friendsPage.css';

const FriendsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('activity'); // activity, friends, requests, discover
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFriendsData();
  }, []);

  const fetchFriendsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data for now - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFriends([
        {
          id: 'friend1',
          username: 'musiclover23',
          displayName: 'Alex Johnson',
          profilePicture: 'https://via.placeholder.com/150',
          isOnline: true,
          lastSeen: '2 minutes ago',
          mutualFriends: 12,
          musicTaste: ['Pop', 'Rock', 'Electronic'],
          recentActivity: 'Shared "Blinding Lights" by The Weeknd'
        },
        {
          id: 'friend2',
          username: 'vinylcollector',
          displayName: 'Sarah Chen',
          profilePicture: 'https://via.placeholder.com/150',
          isOnline: false,
          lastSeen: '1 hour ago',
          mutualFriends: 8,
          musicTaste: ['Jazz', 'Classical', 'Indie'],
          recentActivity: 'Created playlist "Chill Sunday"'
        },
        {
          id: 'friend3',
          username: 'concertgoer',
          displayName: 'Mike Rodriguez',
          profilePicture: 'https://via.placeholder.com/150',
          isOnline: true,
          lastSeen: 'Online now',
          mutualFriends: 15,
          musicTaste: ['Hip Hop', 'R&B', 'Pop'],
          recentActivity: 'Liked your post about "Levitating"'
        }
      ]);

      setFriendRequests([
        {
          id: 'request1',
          username: 'newuser456',
          displayName: 'Emma Wilson',
          profilePicture: 'https://via.placeholder.com/150',
          mutualFriends: 3,
          musicTaste: ['Pop', 'Electronic'],
          requestDate: '2024-01-15'
        },
        {
          id: 'request2',
          username: 'musicfan99',
          displayName: 'David Kim',
          profilePicture: 'https://via.placeholder.com/150',
          mutualFriends: 7,
          musicTaste: ['Rock', 'Alternative'],
          requestDate: '2024-01-14'
        }
      ]);

      setActivityFeed([
        {
          id: 'activity1',
          type: 'shared_track',
          user: {
            username: 'musiclover23',
            displayName: 'Alex Johnson',
            profilePicture: 'https://via.placeholder.com/150'
          },
          track: {
            title: 'Blinding Lights',
            artist: 'The Weeknd',
            albumArt: 'https://via.placeholder.com/150'
          },
          timestamp: '2 minutes ago',
          note: 'This song hits different at night 🌙'
        },
        {
          id: 'activity2',
          type: 'created_playlist',
          user: {
            username: 'vinylcollector',
            displayName: 'Sarah Chen',
            profilePicture: 'https://via.placeholder.com/150'
          },
          playlist: {
            name: 'Chill Sunday',
            tracksCount: 25,
            image: 'https://via.placeholder.com/150'
          },
          timestamp: '1 hour ago'
        },
        {
          id: 'activity3',
          type: 'liked_post',
          user: {
            username: 'concertgoer',
            displayName: 'Mike Rodriguez',
            profilePicture: 'https://via.placeholder.com/150'
          },
          post: {
            track: {
              title: 'Levitating',
              artist: 'Dua Lipa',
              albumArt: 'https://via.placeholder.com/150'
            },
            note: 'Perfect workout song!'
          },
          timestamp: '3 hours ago'
        }
      ]);

      setSuggestedFriends([
        {
          id: 'suggest1',
          username: 'indiemusic',
          displayName: 'Lisa Park',
          profilePicture: 'https://via.placeholder.com/150',
          mutualFriends: 5,
          musicTaste: ['Indie', 'Alternative', 'Folk'],
          reason: 'You both love Indie music'
        },
        {
          id: 'suggest2',
          username: 'jazzenthusiast',
          displayName: 'Tom Anderson',
          profilePicture: 'https://via.placeholder.com/150',
          mutualFriends: 2,
          musicTaste: ['Jazz', 'Blues', 'Soul'],
          reason: 'Similar music taste'
        }
      ]);

    } catch (err) {
      console.error('Error fetching friends data:', err);
      setError('Failed to load friends data');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = (requestId) => {
    const request = friendRequests.find(r => r.id === requestId);
    if (request) {
      setFriends(prev => [...prev, { ...request, isOnline: false, lastSeen: 'Unknown' }]);
      setFriendRequests(prev => prev.filter(r => r.id !== requestId));
    }
  };

  const handleRejectRequest = (requestId) => {
    setFriendRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const handleAddFriend = (suggestedFriend) => {
    // In a real app, this would send a friend request
    console.log('Sending friend request to:', suggestedFriend.displayName);
    setSuggestedFriends(prev => prev.filter(f => f.id !== suggestedFriend.id));
  };

  const handleUnfriend = (friendId) => {
    setFriends(prev => prev.filter(f => f.id !== friendId));
  };

  const filteredData = (data) => {
    if (!searchQuery) return data;
    return data.filter(item => 
      item.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderActivityFeed = () => (
    <div className="activity-content">
      <div className="content-header">
        <h2>📱 Recent Activity</h2>
        <span className="activity-count">{activityFeed.length} activities</span>
      </div>
      
      <div className="activity-list">
        {activityFeed.map((activity) => (
          <div key={activity.id} className="activity-item glassmorphism">
            <img 
              src={activity.user.profilePicture} 
              alt={activity.user.displayName}
              className="activity-avatar"
            />
            <div className="activity-content">
              <div className="activity-header">
                <span className="user-name">{activity.user.displayName}</span>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
              
              {activity.type === 'shared_track' && (
                <div className="activity-details">
                  <p className="activity-text">
                    shared <strong>{activity.track.title}</strong> by {activity.track.artist}
                  </p>
                  {activity.note && (
                    <p className="activity-note">"{activity.note}"</p>
                  )}
                  <div className="track-preview">
                    <img src={activity.track.albumArt} alt={activity.track.title} />
                    <div className="track-info">
                      <span className="track-title">{activity.track.title}</span>
                      <span className="track-artist">{activity.track.artist}</span>
                    </div>
                    <button className="play-btn">▶️</button>
                  </div>
                </div>
              )}
              
              {activity.type === 'created_playlist' && (
                <div className="activity-details">
                  <p className="activity-text">
                    created playlist <strong>{activity.playlist.name}</strong>
                  </p>
                  <div className="playlist-preview">
                    <img src={activity.playlist.image} alt={activity.playlist.name} />
                    <div className="playlist-info">
                      <span className="playlist-name">{activity.playlist.name}</span>
                      <span className="playlist-tracks">{activity.playlist.tracksCount} tracks</span>
                    </div>
                    <button className="play-btn">▶️</button>
                  </div>
                </div>
              )}
              
              {activity.type === 'liked_post' && (
                <div className="activity-details">
                  <p className="activity-text">
                    liked your post about <strong>{activity.post.track.title}</strong>
                  </p>
                  <div className="post-preview">
                    <img src={activity.post.track.albumArt} alt={activity.post.track.title} />
                    <div className="post-info">
                      <span className="post-track">{activity.post.track.title} - {activity.post.track.artist}</span>
                      <span className="post-note">"{activity.post.note}"</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFriends = () => (
    <div className="friends-content">
      <div className="content-header">
        <h2>👥 My Friends</h2>
        <span className="friends-count">{friends.length} friends</span>
      </div>
      
      <div className="friends-grid">
        {filteredData(friends).map((friend) => (
          <div key={friend.id} className="friend-card glassmorphism">
            <div className="friend-header">
              <img 
                src={friend.profilePicture} 
                alt={friend.displayName}
                className="friend-avatar"
              />
              <div className={`online-status ${friend.isOnline ? 'online' : 'offline'}`}></div>
            </div>
            
            <div className="friend-info">
              <h3 className="friend-name">{friend.displayName}</h3>
              <p className="friend-username">@{friend.username}</p>
              <p className="friend-status">
                {friend.isOnline ? 'Online now' : `Last seen ${friend.lastSeen}`}
              </p>
              <p className="mutual-friends">{friend.mutualFriends} mutual friends</p>
            </div>
            
            <div className="friend-taste">
              <h4>Music Taste:</h4>
              <div className="taste-tags">
                {friend.musicTaste.map((genre, index) => (
                  <span key={index} className="taste-tag">{genre}</span>
                ))}
              </div>
            </div>
            
            <div className="friend-activity">
              <p className="recent-activity">{friend.recentActivity}</p>
            </div>
            
            <div className="friend-actions">
              <button className="message-btn">💬 Message</button>
              <button 
                className="unfriend-btn"
                onClick={() => handleUnfriend(friend.id)}
              >
                🗑️ Unfriend
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFriendRequests = () => (
    <div className="requests-content">
      <div className="content-header">
        <h2>📨 Friend Requests</h2>
        <span className="requests-count">{friendRequests.length} pending</span>
      </div>
      
      <div className="requests-list">
        {filteredData(friendRequests).map((request) => (
          <div key={request.id} className="request-item glassmorphism">
            <img 
              src={request.profilePicture} 
              alt={request.displayName}
              className="request-avatar"
            />
            
            <div className="request-info">
              <h3 className="request-name">{request.displayName}</h3>
              <p className="request-username">@{request.username}</p>
              <p className="mutual-friends">{request.mutualFriends} mutual friends</p>
              
              <div className="request-taste">
                <h4>Music Taste:</h4>
                <div className="taste-tags">
                  {request.musicTaste.map((genre, index) => (
                    <span key={index} className="taste-tag">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="request-actions">
              <button 
                className="accept-btn"
                onClick={() => handleAcceptRequest(request.id)}
              >
                ✅ Accept
              </button>
              <button 
                className="reject-btn"
                onClick={() => handleRejectRequest(request.id)}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSuggestedFriends = () => (
    <div className="suggestions-content">
      <div className="content-header">
        <h2>🔍 Suggested Friends</h2>
        <span className="suggestions-count">{suggestedFriends.length} suggestions</span>
      </div>
      
      <div className="suggestions-grid">
        {filteredData(suggestedFriends).map((suggestion) => (
          <div key={suggestion.id} className="suggestion-card glassmorphism">
            <img 
              src={suggestion.profilePicture} 
              alt={suggestion.displayName}
              className="suggestion-avatar"
            />
            
            <div className="suggestion-info">
              <h3 className="suggestion-name">{suggestion.displayName}</h3>
              <p className="suggestion-username">@{suggestion.username}</p>
              <p className="mutual-friends">{suggestion.mutualFriends} mutual friends</p>
              <p className="suggestion-reason">{suggestion.reason}</p>
              
              <div className="suggestion-taste">
                <h4>Music Taste:</h4>
                <div className="taste-tags">
                  {suggestion.musicTaste.map((genre, index) => (
                    <span key={index} className="taste-tag">{genre}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              className="add-friend-btn"
              onClick={() => handleAddFriend(suggestion)}
            >
              ➕ Add Friend
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'activity':
        return renderActivityFeed();
      case 'friends':
        return renderFriends();
      case 'requests':
        return renderFriendRequests();
      case 'discover':
        return renderSuggestedFriends();
      default:
        return renderActivityFeed();
    }
  };

  if (loading) {
    return (
      <div className="friends-loading">
        <div className="spinner"></div>
        <p>Loading your social feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchFriendsData} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="friends-page">
      <div className="friends-header">
        <h1>👥 Friends & Activity</h1>
        <p>Stay connected with your music community</p>
      </div>

      <div className="friends-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      <div className="friends-tabs">
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📱 Activity
        </button>
        <button 
          className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
          onClick={() => setActiveTab('friends')}
        >
          👥 Friends
        </button>
        <button 
          className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          📨 Requests
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Discover
        </button>
      </div>

      <div className="friends-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default FriendsPage;


