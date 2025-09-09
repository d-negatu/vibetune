import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './ProfileSetup.css';

const ProfileSetup = ({ onComplete }) => {
  const { updateUserProfile, userProfile } = useUserProfile();
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    bio: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.displayName.trim()) {
        setError('Display name is required');
        setLoading(false);
        return;
      }

      // Update user profile
      const success = await updateUserProfile({
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        profilePicture: formData.profilePicture.trim(),
        profileCompleted: true,
        setupCompletedAt: new Date()
      });

      if (success) {
        onComplete();
      } else {
        setError('Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Create minimal profile and continue
    updateUserProfile({
      displayName: userProfile?.userId || 'User',
      bio: '',
      profilePicture: '',
      profileCompleted: true,
      setupCompletedAt: new Date()
    }).then(() => {
      onComplete();
    });
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="profile-setup-page">
      <div className="profile-setup-container">
        <div className="setup-header">
          <div className="setup-logo">
            <span>V</span>
          </div>
          <h1>Welcome to VibeTune!</h1>
          <p>Let's set up your profile to get started</p>
        </div>

        <div className="setup-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <span className="progress-text">Step {step} of 3</span>
        </div>

        <form onSubmit={handleSubmit} className="setup-form">
          {step === 1 && (
            <div className="setup-step">
              <div className="step-icon">
                <Icon icon="material-symbols:person" />
              </div>
              <h2>What should we call you?</h2>
              <p>Choose a display name that other users will see</p>
              
              <div className="form-group">
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Enter your display name"
                  className="setup-input"
                  maxLength={30}
                  required
                />
                <div className="input-hint">
                  {formData.displayName.length}/30 characters
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="setup-step">
              <div className="step-icon">
                <Icon icon="material-symbols:description" />
              </div>
              <h2>Tell us about yourself</h2>
              <p>Write a short bio to let others know who you are (optional)</p>
              
              <div className="form-group">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Share something about yourself..."
                  className="setup-textarea"
                  rows="4"
                  maxLength={150}
                />
                <div className="input-hint">
                  {formData.bio.length}/150 characters
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="setup-step">
              <div className="step-icon">
                <Icon icon="material-symbols:photo-camera" />
              </div>
              <h2>Add a profile picture</h2>
              <p>Upload a photo or use your initials (optional)</p>
              
              <div className="profile-picture-section">
                <div className="profile-preview">
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Profile preview" />
                  ) : (
                    <span>{formData.displayName?.charAt(0)?.toUpperCase() || 'U'}</span>
                  )}
                </div>
                
                <div className="form-group">
                  <input
                    type="url"
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleInputChange}
                    placeholder="Paste image URL here"
                    className="setup-input"
                  />
                  <div className="input-hint">
                    Paste a URL to an image you'd like to use
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <Icon icon="material-symbols:error-outline" />
              <span>{error}</span>
            </div>
          )}

          <div className="setup-actions">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="back-btn">
                <Icon icon="material-symbols:arrow-back" />
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={nextStep} className="next-btn">
                Next
                <Icon icon="material-symbols:arrow-forward" />
              </button>
            ) : (
              <div className="final-actions">
                <button type="button" onClick={handleSkip} className="skip-btn">
                  Skip for now
                </button>
                <button type="submit" disabled={loading} className="complete-btn">
                  {loading ? (
                    <>
                      <div className="loading-spinner-small"></div>
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Icon icon="material-symbols:check" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
