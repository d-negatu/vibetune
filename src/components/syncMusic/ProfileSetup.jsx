import React, { useState, useEffect } from 'react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './ProfileSetup.css';

const ProfileSetup = ({ onComplete }) => {
  const { updateUserProfile, userProfile } = useUserProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    bio: '',
    profilePicture: '',
    musicGenres: [],
    favoriteArtists: [],
    musicMood: '',
    privacySettings: {
      showListeningActivity: true,
      allowFriendRequests: true,
      showTopTracks: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const musicGenres = [
    'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Electronic', 'Jazz', 'Classical', 
    'Country', 'Indie', 'Alternative', 'Folk', 'Blues', 'Reggae', 'Punk'
  ];

  const musicMoods = [
    { value: 'energetic', label: 'Energetic', emoji: '⚡' },
    { value: 'chill', label: 'Chill', emoji: '😌' },
    { value: 'party', label: 'Party', emoji: '🎉' },
    { value: 'romantic', label: 'Romantic', emoji: '💕' },
    { value: 'melancholic', label: 'Melancholic', emoji: '😔' },
    { value: 'motivational', label: 'Motivational', emoji: '💪' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre) => {
    setFormData(prev => ({
      ...prev,
      musicGenres: prev.musicGenres.includes(genre)
        ? prev.musicGenres.filter(g => g !== genre)
        : [...prev.musicGenres, genre]
    }));
  };

  const handlePrivacyChange = (setting) => {
    setFormData(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: !prev.privacySettings[setting]
      }
    }));
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.displayName.trim()) {
        setError('Display name is required');
        setLoading(false);
        return;
      }

      const success = await updateUserProfile({
        ...formData,
        profileCompleted: true,
        setupCompletedAt: new Date()
      });

      if (success) {
        onComplete();
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h2>Welcome to Vibetune! 🎵</h2>
      <p>Let's set up your profile to get started</p>
      
      <div className="form-group">
        <label htmlFor="displayName">Display Name *</label>
        <input
          type="text"
          id="displayName"
          name="displayName"
          value={formData.displayName}
          onChange={handleInputChange}
          placeholder="How should friends see you?"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio (Optional)</label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          placeholder="Tell us about your music taste..."
          rows="3"
        />
      </div>

      <div className="form-group">
        <label htmlFor="profilePicture">Profile Picture URL (Optional)</label>
        <input
          type="url"
          id="profilePicture"
          name="profilePicture"
          value={formData.profilePicture}
          onChange={handleInputChange}
          placeholder="https://example.com/your-photo.jpg"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="step-content">
      <h2>What genres do you love? 🎶</h2>
      <p>Select all that apply</p>
      
      <div className="genres-grid">
        {musicGenres.map(genre => (
          <button
            key={genre}
            type="button"
            className={`genre-chip ${formData.musicGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreToggle(genre)}
          >
            {genre}
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="step-content">
      <h2>What's your music mood? 🎭</h2>
      <p>Choose your primary music vibe</p>
      
      <div className="mood-options">
        {musicMoods.map(mood => (
          <button
            key={mood.value}
            type="button"
            className={`mood-option ${formData.musicMood === mood.value ? 'selected' : ''}`}
            onClick={() => setFormData(prev => ({ ...prev, musicMood: mood.value }))}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="step-content">
      <h2>Privacy Settings 🔒</h2>
      <p>Control what others can see about your music activity</p>
      
      <div className="privacy-settings">
        <div className="privacy-option">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={formData.privacySettings.showListeningActivity}
              onChange={() => handlePrivacyChange('showListeningActivity')}
            />
            <span className="privacy-text">
              <strong>Show listening activity</strong>
              <small>Let friends see what you're currently playing</small>
            </span>
          </label>
        </div>

        <div className="privacy-option">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={formData.privacySettings.allowFriendRequests}
              onChange={() => handlePrivacyChange('allowFriendRequests')}
            />
            <span className="privacy-text">
              <strong>Allow friend requests</strong>
              <small>Let other users send you friend requests</small>
            </span>
          </label>
        </div>

        <div className="privacy-option">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={formData.privacySettings.showTopTracks}
              onChange={() => handlePrivacyChange('showTopTracks')}
            />
            <span className="privacy-text">
              <strong>Show top tracks</strong>
              <small>Display your most played songs on your profile</small>
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="profile-setup">
      <div className="setup-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          ></div>
        </div>

        <div className="step-indicator">
          Step {currentStep} of 4
        </div>

        <form onSubmit={handleSubmit}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="step-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={handleBack} className="back-button">
                ← Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button type="button" onClick={handleNext} className="next-button">
                Next →
              </button>
            ) : (
              <button 
                type="submit" 
                className="complete-button"
                disabled={loading || !formData.displayName.trim()}
              >
                {loading ? 'Setting up...' : 'Complete Setup 🎉'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;