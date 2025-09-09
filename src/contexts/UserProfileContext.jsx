import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

export const UserProfileProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to get the correct API base URL
  const getApiBaseUrl = () => {
    return import.meta.env.DEV 
      ? 'http://localhost:5001/mapbot-9a988/us-central1'
      : 'https://us-central1-mapbot-9a988.cloudfunctions.net';
  };

  // Default profile structure
  const defaultProfile = {
    userId: '',
    displayName: '',
    bio: '',
    profilePicture: '',
    spotifyConnected: true,
    followers: [],
    following: [],
    postsCount: 0,
    likesReceived: 0,
    profileCompleted: false,
    setupCompletedAt: null,
    createdAt: new Date(),
    lastActive: new Date(),
    preferences: {
      theme: 'dark',
      notifications: true,
      privacy: 'public'
    }
  };

  // Fetch user profile from API
  const fetchUserProfile = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/getUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        const profile = await response.json();
        setUserProfile(profile);
      } else {
        // If profile doesn't exist, create a new one
        await createUserProfile(userId);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  // Create new user profile
  const createUserProfile = async (userId) => {
    try {
      const newProfile = {
        ...defaultProfile,
        userId: userId,
        displayName: userId, // Use userId as default display name
        createdAt: new Date(),
        lastActive: new Date()
      };

      const response = await fetch(`${getApiBaseUrl()}/createUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProfile)
      });

      if (response.ok) {
        setUserProfile(newProfile);
      } else {
        throw new Error('Failed to create user profile');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      setError('Failed to create user profile');
    }
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!userProfile) return;

    setLoading(true);
    setError(null);

    try {
      const updatedProfile = { ...userProfile, ...updates, lastActive: new Date() };
      
      const response = await fetch(`${getApiBaseUrl()}/updateUserProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userProfile.userId, updates })
      });

      if (response.ok) {
        setUserProfile(updatedProfile);
        return true;
      } else {
        throw new Error('Failed to update user profile');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError('Failed to update user profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Follow/Unfollow user
  const toggleFollow = async (targetUserId) => {
    if (!userProfile) return;

    const isFollowing = userProfile.following.includes(targetUserId);
    const newFollowing = isFollowing 
      ? userProfile.following.filter(id => id !== targetUserId)
      : [...userProfile.following, targetUserId];

    try {
      const response = await fetch(`${getApiBaseUrl()}/toggleFollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: userProfile.userId, 
          targetUserId, 
          action: isFollowing ? 'unfollow' : 'follow' 
        })
      });

      if (response.ok) {
        setUserProfile(prev => ({
          ...prev,
          following: newFollowing
        }));
        return true;
      } else {
        throw new Error('Failed to update follow status');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      setError('Failed to update follow status');
      return false;
    }
  };

  // Get user by ID
  const getUserById = async (userId) => {
    try {
      const response = await fetch(`https://us-central1-mapbot-9a988.cloudfunctions.net/getUserById`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };

  // Load user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      fetchUserProfile(user.userId);
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user?.userId]);

  const value = {
    userProfile,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    toggleFollow,
    getUserById,
    setError
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
