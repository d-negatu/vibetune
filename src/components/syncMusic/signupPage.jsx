/**
 * SignupPage.jsx
 * 
 * This component handles user registration with email/password
 * and optional Spotify connection for enhanced music features.
 * 
 * @module SignupPage
 */

import React, { useState, useEffect } from "react";
// import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './signupPage.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();
  const { signUp: firebaseSignUp, user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();

  // Check if user is already logged in
  useEffect(() => {
    if (user || firebaseUser) {
      // User is already logged in, redirect to dashboard or vibe page
      window.location.href = '/vibe';
    }
  }, [user, firebaseUser]);

  // Initialize particles when component mounts
  useEffect(() => {
    const initParticles = () => {
      if (window.particlesJS) {
        window.particlesJS.load('particles-js-signup', '/particles.json', function() {
          console.log('Particles.js loaded successfully');
        });
      } else {
        setTimeout(initParticles, 100);
      }
    };

    initParticles();

    return () => {
      if (window.pJSDom && window.pJSDom[0]) {
        window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
      }
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Use Firebase Auth to create user
      const firebaseUser = await firebaseSignUp(formData.email, formData.password);
      
      // Create user profile in Firestore
      const profileData = {
        userId: firebaseUser.uid,
        displayName: formData.username,
        bio: '',
        profilePicture: '',
        musicGenres: [],
        favoriteArtists: [],
        musicMood: '',
        spotifyConnected: false,
        followers: [],
        following: [],
        postsCount: 0,
        likesReceived: 0,
        profileCompleted: false,
        setupCompletedAt: null,
        preferences: {
          theme: 'dark',
          notifications: true,
          privacy: 'public'
        },
        privacySettings: {
          showListeningActivity: true,
          allowFriendRequests: true,
          showTopTracks: true
        }
      };

      // Call createUserProfile Cloud Function
      const apiBaseUrl = import.meta.env.DEV 
        ? 'http://localhost:5001/mapbot-9a988/us-central1'
        : 'https://us-central1-mapbot-9a988.cloudfunctions.net';

      const profileResponse = await fetch(`${apiBaseUrl}/createUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!profileResponse.ok) {
        console.warn('Failed to create user profile, but user was created successfully');
      }
      
      // Create user data for the auth context
      const userData = {
        uid: firebaseUser.uid,
        userId: firebaseUser.uid, // Map uid to userId for compatibility
        email: firebaseUser.email,
        username: formData.username,
        displayName: formData.username,
        profileCompleted: false
      };
      
      // Login the user using the existing auth context
      login(userData);
      
      // Redirect to profile setup
      window.location.href = '/profile-setup';
      
    } catch (error) {
      console.error('Signup error:', error);
      
      // Handle Firebase Auth specific error messages
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters long.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleSpotifySignup = () => {
    // Redirect to Spotify OAuth for signup
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = "http://localhost:5173/callback";
    const scopes = [
      "user-read-private",
      "user-read-email", 
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-top-read",       
      "streaming",
    ].join("%20");
    
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&show_dialog=true`;
    window.location.href = authUrl;
  };

  return (
    <div className="signup-page">
      <div id="particles-js-signup"></div>
      <div className="signup-container">
        <div className="logo-icon">🎵</div>
        <h1 className="brand-title">Join Vibetune</h1>
        <p className="subtitle">Create your account to start sharing music with friends</p>
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`input-field ${errors.username ? 'error' : ''}`}
              placeholder="Username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`input-field ${errors.email ? 'error' : ''}`}
              placeholder="Email address"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`input-field ${errors.password ? 'error' : ''}`}
              placeholder="Password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`input-field ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="checkbox-input"
              />
              <span className="checkbox-text">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and <a href="#" className="terms-link">Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
          </div>

          <button 
            type="submit" 
            className="signup-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-icon">⏳</span>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <div className="social-signup">
          <button className="auth-button spotify" onClick={handleSpotifySignup}>
            <span className="auth-icon">🎵</span>
            <span>Sign up with Spotify</span>
          </button>
        </div>

        <div className="login-link">
          <span>Already have an account? </span>
          <a href="/login" className="login-text">Sign in</a>
        </div>

        {/* Debug: Logout button for testing */}
        {(user || firebaseUser) && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <p>You are already logged in as: {user?.email || firebaseUser?.email}</p>
            <button 
              onClick={logout}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#ff4444', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
