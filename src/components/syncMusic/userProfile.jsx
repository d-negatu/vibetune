import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './UserProfile.css';

const UserProfile = ({ userId, onClose, isOwnProfile = false }) => {
  const { userProfile, getUserById, toggleFollow, updateUserProfile } = useUserProfile();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile && userProfile) {
          setProfile(userProfile);
          setIsFollowing(false);
        } else {
          const userData = await getUserById(userId);
          if (userData) {
            setProfile(userData);
            setIsFollowing(userProfile?.following?.includes(userId) || false);
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId, isOwnProfile, userProfile, getUserById]);

  const handleFollowToggle = async () => {
    if (!profile) return;
    
    const success = await toggleFollow(profile.userId);
    if (success) {
      setIsFollowing(!isFollowing);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const success = await updateUserProfile(editForm);
    if (success) {
      setShowEditForm(false);
      setEditForm({ displayName: '', bio: '' });
    }
  };

  const handleEditClick = () => {
    setEditForm({
      displayName: profile?.displayName || '',
      bio: profile?.bio || ''
    });
    setShowEditForm(true);
  };

  if (loading) {
    return (
      <div className="user-profile-modal">
        <div className="user-profile-content">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="user-profile-modal">
        <div className="user-profile-content">
          <div className="error-state">
            <Icon icon="material-symbols:error-outline" className="error-icon" />
            <p>Profile not found</p>
            <button onClick={onClose} className="retry-btn">Close</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-modal" onClick={onClose}>
      <div className="user-profile-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <button className="close-btn" onClick={onClose}>
            <Icon icon="material-symbols:close" />
          </button>
        </div>

        <div className="profile-main">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.displayName} />
              ) : (
                <span>{profile.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
          </div>

          <div className="profile-info">
            <h2 className="profile-name">{profile.displayName}</h2>
            <p className="profile-bio">{profile.bio || 'No bio yet'}</p>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{profile.postsCount || 0}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.followers?.length || 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{profile.following?.length || 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {isOwnProfile ? (
            <button className="edit-btn" onClick={handleEditClick}>
              <Icon icon="material-symbols:edit" />
              Edit Profile
            </button>
          ) : (
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowToggle}
            >
              <Icon icon={isFollowing ? "material-symbols:person-remove" : "material-symbols:person-add"} />
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>

        {showEditForm && (
          <div className="edit-form-overlay">
            <div className="edit-form">
              <h3>Edit Profile</h3>
              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                    placeholder="Enter display name"
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                    placeholder="Tell us about yourself"
                    rows="3"
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowEditForm(false)}>
                    Cancel
                  </button>
                  <button type="submit">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;