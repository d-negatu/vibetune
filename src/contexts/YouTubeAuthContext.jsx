/**
 * YouTube Auth Context
 * 
 * Manages YouTube Music connection state and token status.
 * Follows the same pattern as SpotifyAuthContext.
 * 
 * Key principles:
 * 1. Check if Firebase user exists (from FirebaseAuthContext)
 * 2. Call Cloud Function to verify if user has YouTube token stored
 * 3. Expose connection state to entire app via context
 * 4. Periodically check connection status
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useFirebaseAuth } from "./FirebaseAuthContext";

// Cloud Function URL - will be updated later
const CLOUD_FN_URL = "https://us-central1-mapbot-9a988.cloudfunctions.net/getYouTubeToken";

// Create context object
const YouTubeAuthContext = createContext(null);

// Hook to use YouTube auth anywhere
export const useYouTubeAuth = () => {
  const context = useContext(YouTubeAuthContext);
  if (!context) throw new Error("useYouTubeAuth must be used within a YouTubeAuthProvider");
  return context;
};

// Provider component
export const YouTubeAuthProvider = ({ children }) => {
  // Get Firebase user from auth context
  const { firebaseUser } = useFirebaseAuth();

  // State management
  const [isYouTubeConnected, setIsYouTubeConnected] = useState(false);
  const [youtubeLoading, setYoutubeLoading] = useState(true);

  // Refs to prevent multiple simultaneous checks
  const isCheckingRef = useRef(false);

  /**
   * Check if user has YouTube token via Cloud Function
   * This is the main logic:
   * 1. Validate user exists
   * 2. Call Cloud Function
   * 3. Set connection state based on response
   */
  const checkYouTubeConnection = useCallback(async () => {
    // Prevent duplicate checks
    if (!firebaseUser?.uid || isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    setYoutubeLoading(true);

    try {
      console.log("[YouTubeAuthContext] Checking YouTube connection for userId:", firebaseUser.uid);

      // Call Cloud Function to check if token exists
      const response = await fetch(CLOUD_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: firebaseUser.uid }),
      });

      const data = await response.json().catch(() => ({}));

      // Handle response
      if (response.ok && data.accessToken) {
        console.log("[YouTubeAuthContext] YouTube is connected");
        setIsYouTubeConnected(true);
      } else {
        console.log("[YouTubeAuthContext] YouTube is not connected");
        setIsYouTubeConnected(false);
      }
    } catch (error) {
      console.error("[YouTubeAuthContext] Error checking YouTube connection:", error);
      setIsYouTubeConnected(false);
    } finally {
      setYoutubeLoading(false);
      isCheckingRef.current = false;
    }
  }, [firebaseUser?.uid]);

  /**
   * Run checks when Firebase user changes
   * 1. Initial check when user logs in
   * 2. Periodic checks every 30 seconds to detect if user connects YouTube
   */
  useEffect(() => {
    // If no Firebase user, clear YouTube connection
    if (!firebaseUser?.uid) {
      setIsYouTubeConnected(false);
      setYoutubeLoading(false);
      return;
    }

    // Initial check
    checkYouTubeConnection();

    // Periodic check every 30 seconds
    const intervalId = setInterval(() => {
      if (firebaseUser?.uid && !isCheckingRef.current) {
        checkYouTubeConnection();
      }
    }, 30000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [firebaseUser?.uid, checkYouTubeConnection]);

  /**
   * Manual refresh - useful when user connects YouTube
   * and we want to check immediately instead of waiting 30s
   */
  const refreshYouTubeAuth = useCallback(() => {
    if (firebaseUser?.uid) {
      console.log("[YouTubeAuthContext] Manual refresh requested");
      checkYouTubeConnection();
    }
  }, [firebaseUser?.uid, checkYouTubeConnection]);

  // Return provider with context value
  return (
    <YouTubeAuthContext.Provider
      value={{
        isYouTubeConnected,
        youtubeLoading,
        refreshYouTubeAuth,
      }}
    >
      {children}
    </YouTubeAuthContext.Provider>
  );
};
