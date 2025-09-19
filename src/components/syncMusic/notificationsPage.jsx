import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './notificationsPage.css';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, likes, follows, mentions, comments
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock notifications data - replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockNotifications = [
        {
          id: 'notif1',
          type: 'like',
          isRead: false,
          timestamp: '2 minutes ago',
          user: {
            username: 'musiclover23',
            displayName: 'Alex Johnson',
            profilePicture: 'https://via.placeholder.com/150'
          },
          content: {
            track: {
              title: 'Blinding Lights',
              artist: 'The Weeknd',
              albumArt: 'https://via.placeholder.com/150'
            },
            post: {
              note: 'This song hits different at night 🌙'
            }
          }
        },
        {
          id: 'notif2',
          type: 'follow',
          isRead: false,
          timestamp: '1 hour ago',
          user: {
            username: 'vinylcollector',
            displayName: 'Sarah Chen',
            profilePicture: 'https://via.placeholder.com/150'
          },
          content: {
            message: 'started following you'
          }
        },
        {
          id: 'notif3',
          type: 'comment',
          isRead: true,
          timestamp: '3 hours ago',
          user: {
            username: 'concertgoer',
            displayName: 'Mike Rodriguez',
            profilePicture: 'https://via.placeholder.com/150'
          },
          content: {
            track: {
              title: 'Levitating',
              artist: 'Dua Lipa',
              albumArt: 'https://via.placeholder.com/150'
            },
            comment: 'Perfect workout song! 💪'
          }
        },
        {
          id: 'notif4',
          type: 'mention',
          isRead: true,
          timestamp: '5 hours ago',
          user: {
            username: 'indiemusic',
            displayName: 'Lisa Park',
            profilePicture: 'https://via.placeholder.com/150'
          },
          content: {
            track: {
              title: 'Heat Waves',
              artist: 'Glass Animals',
              albumArt: 'https://via.placeholder.com/150'
            },
            post: {
              note: 'Check out this amazing track @musiclover23!'
            }
          }
        },
        {
          id: 'notif5',
          type: 'share',
          isRead: false,
          timestamp: '1 day ago',
          user: {
            username: 'jazzenthusiast',
            displayName: 'Tom Anderson',
            profilePicture: 'https://via.placeholder.com/150'
          },
          content: {
            playlist: {
              name: 'Chill Sunday',
              image: 'https://via.placeholder.com/150',
              tracksCount: 25
            }
          }
        }
      ];

      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.isRead).length);

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification && !notification.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    return notif.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like': return '❤️';
      case 'follow': return '👥';
      case 'comment': return '💬';
      case 'mention': return '📢';
      case 'share': return '📤';
      default: return '🔔';
    }
  };

  const getNotificationMessage = (notification) => {
    const { type, user, content } = notification;
    
    switch (type) {
      case 'like':
        return `${user.displayName} liked your post about "${content.track.title}"`;
      case 'follow':
        return `${user.displayName} started following you`;
      case 'comment':
        return `${user.displayName} commented on your post: "${content.comment}"`;
      case 'mention':
        return `${user.displayName} mentioned you in a post`;
      case 'share':
        return `${user.displayName} shared your playlist "${content.playlist.name}"`;
      default:
        return 'New notification';
    }
  };

  const renderNotificationContent = (notification) => {
    const { type, content } = notification;
    
    switch (type) {
      case 'like':
      case 'comment':
      case 'mention':
        return (
          <div className="notification-track">
            <img src={content.track.albumArt} alt={content.track.title} />
            <div className="track-info">
              <span className="track-title">{content.track.title}</span>
              <span className="track-artist">{content.track.artist}</span>
            </div>
          </div>
        );
      case 'share':
        return (
          <div className="notification-playlist">
            <img src={content.playlist.image} alt={content.playlist.name} />
            <div className="playlist-info">
              <span className="playlist-name">{content.playlist.name}</span>
              <span className="playlist-tracks">{content.playlist.tracksCount} tracks</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="notifications-loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <button onClick={fetchNotifications} className="retry-btn">Try Again</button>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1>🔔 Notifications</h1>
        <div className="header-actions">
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="mark-all-read-btn">
              Mark all as read
            </button>
          )}
          <span className="unread-count">{unreadCount} unread</span>
        </div>
      </div>

      <div className="notifications-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'likes' ? 'active' : ''}`}
          onClick={() => setFilter('likes')}
        >
          ❤️ Likes ({notifications.filter(n => n.type === 'like').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'follows' ? 'active' : ''}`}
          onClick={() => setFilter('follows')}
        >
          👥 Follows ({notifications.filter(n => n.type === 'follow').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'comments' ? 'active' : ''}`}
          onClick={() => setFilter('comments')}
        >
          💬 Comments ({notifications.filter(n => n.type === 'comment').length})
        </button>
        <button 
          className={`filter-btn ${filter === 'mentions' ? 'active' : ''}`}
          onClick={() => setFilter('mentions')}
        >
          📢 Mentions ({notifications.filter(n => n.type === 'mention').length})
        </button>
      </div>

      <div className="notifications-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-notifications">
            <div className="no-notifications-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for new activity.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item glassmorphism ${!notification.isRead ? 'unread' : ''}`}
              onClick={() => !notification.isRead && markAsRead(notification.id)}
            >
              <div className="notification-avatar">
                <img 
                  src={notification.user.profilePicture} 
                  alt={notification.user.displayName}
                />
                <div className={`notification-icon ${notification.type}`}>
                  {getNotificationIcon(notification.type)}
                </div>
              </div>
              
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-message">
                    {getNotificationMessage(notification)}
                  </span>
                  <span className="notification-time">{notification.timestamp}</span>
                </div>
                
                {renderNotificationContent(notification)}
              </div>
              
              <div className="notification-actions">
                {!notification.isRead && (
                  <div className="unread-indicator"></div>
                )}
                <button 
                  className="delete-notification-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(notification.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;


