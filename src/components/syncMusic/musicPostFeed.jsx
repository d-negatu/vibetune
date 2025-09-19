import React, { useState } from 'react';
import './musicPostFeed.css';

const MusicPostFeed = ({ posts, onLike, onPlay, onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const handleLike = (postId) => {
    if (onLike) {
      onLike(postId);
    }
  };

  const handlePlay = (track) => {
    if (onPlay) {
      onPlay(track);
    }
  };

  const handleComment = (postId) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleRefresh = () => {
    setLoading(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => setLoading(false), 1000);
  };

  if (posts.length === 0) {
    return (
      <div className="feed-empty">
        <div className="empty-state">
          <div className="empty-icon">🎵</div>
          <h3>No posts yet</h3>
          <p>Be the first to share your favorite music!</p>
          <button className="refresh-button" onClick={handleRefresh}>
            🔄 Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="music-post-feed">
      <div className="feed-header">
        <h2>Music Feed</h2>
        <button 
          className={`refresh-button ${loading ? 'loading' : ''}`}
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? '⏳' : '🔄'} Refresh
        </button>
      </div>

      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="music-post">
            {/* Post Header */}
            <div className="post-header">
              <div className="user-info">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name}
                  className="user-avatar"
                />
                <div className="user-details">
                  <div className="user-name">
                    {post.user.name}
                    {post.user.verified && <span className="verified-badge">✓</span>}
                  </div>
                  <div className="post-time">
                    {formatTimeAgo(post.timestamp)}
                  </div>
                </div>
              </div>
              <button className="more-button">⋯</button>
            </div>

            {/* Track Card */}
            <div className="track-card" onClick={() => handlePlay(post.track)}>
              <img 
                src={post.track.image} 
                alt={post.track.name}
                className="track-image"
              />
              <div className="track-info">
                <h3 className="track-name">{post.track.name}</h3>
                <p className="track-artist">{post.track.artist}</p>
                <p className="track-album">{post.track.album}</p>
              </div>
              <button className="play-overlay">
                <span className="play-icon">▶️</span>
              </button>
            </div>

            {/* Post Caption */}
            {post.caption && (
              <div className="post-caption">
                <p>{post.caption}</p>
              </div>
            )}

            {/* Post Actions */}
            <div className="post-actions">
              <button 
                className={`action-button like-button ${post.isLiked ? 'liked' : ''}`}
                onClick={() => handleLike(post.id)}
              >
                <span className="action-icon">
                  {post.isLiked ? '❤️' : '🤍'}
                </span>
                <span className="action-count">{post.likes}</span>
              </button>

              <button 
                className="action-button comment-button"
                onClick={() => handleComment(post.id)}
              >
                <span className="action-icon">💬</span>
                <span className="action-count">{post.comments}</span>
              </button>

              <button 
                className="action-button share-button"
                onClick={() => handleShare(post.id)}
              >
                <span className="action-icon">📤</span>
                <span className="action-count">Share</span>
              </button>

              <button 
                className="action-button spotify-button"
                onClick={() => window.open(post.spotifyUrl, '_blank')}
              >
                <span className="action-icon">🎵</span>
                <span className="action-count">Spotify</span>
              </button>
            </div>

            {/* Comments Preview */}
            {post.comments > 0 && (
              <div className="comments-preview">
                <button className="view-comments">
                  View {post.comments} comment{post.comments !== 1 ? 's' : ''}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MusicPostFeed;