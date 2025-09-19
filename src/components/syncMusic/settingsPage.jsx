import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './settingsPage.css';

const SettingsPage = () => {
  const { user, logout } = useAuth();
  const { userProfile, updateUserProfile } = useUserProfile();
  const [activeTab, setActiveTab] = useState('profile'); // profile, privacy, notifications, account, appearance
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    displayName: '',
    username: '',
    bio: '',
    profilePicture: '',
    location: '',
    website: ''
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showActivity: true,
    allowMessages: 'friends', // everyone, friends, none
    showListeningActivity: true,
    showPlaylists: 'public' // public, friends, private
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    likeNotifications: true,
    followNotifications: true,
    commentNotifications: true,
    mentionNotifications: true,
    shareNotifications: true,
    weeklyDigest: true
  });

  // Account settings
  const [accountSettings, setAccountSettings] = useState({
    email: '',
    changePassword: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    deleteAccount: false
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark', // light, dark, auto
    language: 'en',
    fontSize: 'medium', // small, medium, large
    animations: true,
    compactMode: false
  });

  useEffect(() => {
    if (userProfile) {
      setProfileSettings({
        displayName: userProfile.displayName || '',
        username: userProfile.username || '',
        bio: userProfile.bio || '',
        profilePicture: userProfile.profilePicture || '',
        location: userProfile.location || '',
        website: userProfile.website || ''
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await updateUserProfile(profileSettings);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, this would call an API to save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Privacy settings updated successfully!');
    } catch (err) {
      console.error('Error updating privacy settings:', err);
      setError('Failed to update privacy settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, this would call an API to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Notification settings updated successfully!');
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError('Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (accountSettings.newPassword !== accountSettings.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // In a real app, this would call an API to change password
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Password changed successfully!');
      setAccountSettings(prev => ({
        ...prev,
        changePassword: false,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // In a real app, this would call an API to delete the account
      await new Promise(resolve => setTimeout(resolve, 2000));
      logout();
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="settings-section">
      <h3>Profile Information</h3>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          <input
            type="text"
            id="displayName"
            value={profileSettings.displayName}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
            placeholder="Your display name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={profileSettings.username}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, username: e.target.value }))}
            placeholder="Your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profileSettings.bio}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell us about yourself..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="profilePicture">Profile Picture URL</label>
          <input
            type="url"
            id="profilePicture"
            value={profileSettings.profilePicture}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, profilePicture: e.target.value }))}
            placeholder="https://example.com/your-picture.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={profileSettings.location}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Your location"
          />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website</label>
          <input
            type="url"
            id="website"
            value={profileSettings.website}
            onChange={(e) => setProfileSettings(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://your-website.com"
          />
        </div>

        <button 
          className="save-btn"
          onClick={handleSaveProfile}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="settings-section">
      <h3>Privacy Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="profileVisibility">Profile Visibility</label>
          <select
            id="profileVisibility"
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
          >
            <option value="public">Public - Anyone can see your profile</option>
            <option value="friends">Friends only - Only your friends can see your profile</option>
            <option value="private">Private - Only you can see your profile</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={privacySettings.showActivity}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, showActivity: e.target.checked }))}
            />
            Show my activity to friends
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="allowMessages">Who can message you</label>
          <select
            id="allowMessages"
            value={privacySettings.allowMessages}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowMessages: e.target.value }))}
          >
            <option value="everyone">Everyone</option>
            <option value="friends">Friends only</option>
            <option value="none">No one</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={privacySettings.showListeningActivity}
              onChange={(e) => setPrivacySettings(prev => ({ ...prev, showListeningActivity: e.target.checked }))}
            />
            Show what I'm listening to
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="showPlaylists">Playlist Visibility</label>
          <select
            id="showPlaylists"
            value={privacySettings.showPlaylists}
            onChange={(e) => setPrivacySettings(prev => ({ ...prev, showPlaylists: e.target.value }))}
          >
            <option value="public">Public - Anyone can see your playlists</option>
            <option value="friends">Friends only - Only your friends can see your playlists</option>
            <option value="private">Private - Only you can see your playlists</option>
          </select>
        </div>

        <button 
          className="save-btn"
          onClick={handleSavePrivacy}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Privacy Settings'}
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3>Notification Preferences</h3>
      <div className="settings-form">
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.emailNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailNotifications: e.target.checked }))}
            />
            Email notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.pushNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
            />
            Push notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.likeNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, likeNotifications: e.target.checked }))}
            />
            Like notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.followNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, followNotifications: e.target.checked }))}
            />
            Follow notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.commentNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, commentNotifications: e.target.checked }))}
            />
            Comment notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.mentionNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, mentionNotifications: e.target.checked }))}
            />
            Mention notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.shareNotifications}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, shareNotifications: e.target.checked }))}
            />
            Share notifications
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={notificationSettings.weeklyDigest}
              onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
            />
            Weekly digest email
          </label>
        </div>

        <button 
          className="save-btn"
          onClick={handleSaveNotifications}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Notification Settings'}
        </button>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="settings-section">
      <h3>Account Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={accountSettings.email}
            onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <button 
            className="change-password-btn"
            onClick={() => setAccountSettings(prev => ({ ...prev, changePassword: !prev.changePassword }))}
          >
            {accountSettings.changePassword ? 'Cancel Password Change' : 'Change Password'}
          </button>
        </div>

        {accountSettings.changePassword && (
          <>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={accountSettings.currentPassword}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={accountSettings.newPassword}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={accountSettings.confirmPassword}
                onChange={(e) => setAccountSettings(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <button 
              className="save-btn"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </>
        )}

        <div className="danger-zone">
          <h4>Danger Zone</h4>
          <button 
            className="delete-account-btn"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="settings-section">
      <h3>Appearance Settings</h3>
      <div className="settings-form">
        <div className="form-group">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            value={appearanceSettings.theme}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, theme: e.target.value }))}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto (System)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="language">Language</label>
          <select
            id="language"
            value={appearanceSettings.language}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, language: e.target.value }))}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fontSize">Font Size</label>
          <select
            id="fontSize"
            value={appearanceSettings.fontSize}
            onChange={(e) => setAppearanceSettings(prev => ({ ...prev, fontSize: e.target.value }))}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={appearanceSettings.animations}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, animations: e.target.checked }))}
            />
            Enable animations
          </label>
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={appearanceSettings.compactMode}
              onChange={(e) => setAppearanceSettings(prev => ({ ...prev, compactMode: e.target.checked }))}
            />
            Compact mode
          </label>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'account':
        return renderAccountSettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Manage your account preferences and privacy</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <div className="settings-container">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
            <button 
              className={`nav-item ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              🔒 Privacy
            </button>
            <button 
              className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              🔔 Notifications
            </button>
            <button 
              className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              🛡️ Account
            </button>
            <button 
              className={`nav-item ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              🎨 Appearance
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


