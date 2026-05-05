/**
 * Calls a Cloud Function to check if the current Firebase user has
 * a Spotify token, and exposes isSpotifyConnected and related helpers. 
 * It does not handle the Spotify OAuth flow itself. 
 * Look at callback page for more details on the Spotify OAuth flow.
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useFirebaseAuth } from "./FirebaseAuthContext";

const CLOUD_FN_URL = "https://us-central1-mapbot-9a988.cloudfunctions.net/getCurrentSpotifyToken";

const SpotifyAuthContext = createContext(null);

export const useSpotifyAuth = () => {
  const context = useContext(SpotifyAuthContext);
  if (!context) throw new Error("useSpotifyAuth must be used within a SpotifyAuthProvider");
  return context;
};

export const SpotifyAuthProvider = ({ children }) => {
  const { firebaseUser } = useFirebaseAuth();
  const [isSpotifyConnected, setIsSpotifyConnected] = useState(false);
  const [spotifyLoading, setSpotifyLoading] = useState(true);
  const checkTimeoutRef = useRef(null);
  const isCheckingRef = useRef(false);

  // Check Spotify connection status via Cloud Function (best practice - secure)
  const checkSpotifyConnection = useCallback(async () => {
    if (!firebaseUser?.uid || isCheckingRef.current) {
      return;
    }

    isCheckingRef.current = true;
    setSpotifyLoading(true);

    try {
      console.log("[SpotifyAuthContext] Checking Spotify connection via Cloud Function for userId:", firebaseUser.uid);
      
      const response = await fetch(CLOUD_FN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: firebaseUser.uid }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.accessToken) {
        console.log("[SpotifyAuthContext] Spotify is connected");
        setIsSpotifyConnected(true);
      } else if (response.status === 404) {
        console.log("[SpotifyAuthContext] Spotify is not connected (404 - no token found)");
        setIsSpotifyConnected(false);
      } else {
        console.warn("[SpotifyAuthContext] Unexpected response:", response.status, data);
        setIsSpotifyConnected(false);
      }
    } catch (error) {
      console.error("[SpotifyAuthContext] Error checking Spotify connection:", error);
      // On network error, assume not connected (better UX than showing false positive)
      setIsSpotifyConnected(false);
    } finally {
      setSpotifyLoading(false);
      isCheckingRef.current = false;
    }
  }, [firebaseUser?.uid]);

  // Check connection when Firebase user changes
  useEffect(() => {
    if (!firebaseUser?.uid) {
      setIsSpotifyConnected(false);
      setSpotifyLoading(false);
      return;
    }

    // Initial check
    checkSpotifyConnection();

    // Set up periodic checks (every 30 seconds) to detect when user connects Spotify
    // This is a lightweight alternative to Firestore listeners
    const intervalId = setInterval(() => {
      if (firebaseUser?.uid && !isCheckingRef.current) {
        checkSpotifyConnection();
      }
    }, 30000); // Check every 30 seconds

    return () => {
      clearInterval(intervalId);
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [firebaseUser?.uid, checkSpotifyConnection]);

  // Manual refresh function
  const refreshSpotifyAuth = useCallback(() => {
    if (firebaseUser?.uid) {
      console.log("[SpotifyAuthContext] Manual refresh requested");
      checkSpotifyConnection();
    }
  }, [firebaseUser?.uid, checkSpotifyConnection]);

  // Backward compatibility aliases
  const loginSpotify = useCallback(() => {
    console.log("[SpotifyAuthContext] loginSpotify called - refreshing connection status");
    refreshSpotifyAuth();
  }, [refreshSpotifyAuth]);

  const logoutSpotify = useCallback(() => {
    console.log("[SpotifyAuthContext] logoutSpotify called - refreshing connection status");
    refreshSpotifyAuth();
  }, [refreshSpotifyAuth]);

  const login = loginSpotify;
  const logout = logoutSpotify;
  const isAuthenticated = isSpotifyConnected;
  const user = null; // We don't store user data in context anymore
  const loading = spotifyLoading;

  return (
    <SpotifyAuthContext.Provider
      value={{
        isSpotifyConnected,
        spotifyLoading,
        loginSpotify,
        logoutSpotify,
        refreshSpotifyAuth,
        // Backward compatibility
        login,
        logout,
        isAuthenticated,
        user,
        loading,
      }}
    >
      {children}
    </SpotifyAuthContext.Provider>
  );
};
