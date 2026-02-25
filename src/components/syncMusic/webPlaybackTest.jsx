// WebPlaybackTest.jsx
import React, { useEffect, useState } from "react";
import WebPlayback from "./webPlayback.jsx";
import "./webPlaybackTest.css";
import { useFirebaseAuth } from "../../contexts/FirebaseAuthContext";
import { useSpotifyAuth } from "../../contexts/SpotifyAuthContext";

const CLOUD_FN_URL =
  "https://us-central1-mapbot-9a988.cloudfunctions.net/getCurrentSpotifyToken";

function WebPlaybackTest() {
  const { firebaseUser, authLoading, authError } = useFirebaseAuth();
  const { isSpotifyConnected, spotifyLoading, refreshSpotifyAuth } = useSpotifyAuth();

  // Debug logging
  useEffect(() => {
    console.log("[WebPlaybackTest] Spotify connection state:", {
      isSpotifyConnected,
      spotifyLoading,
      firebaseUserId: firebaseUser?.uid,
    });
  }, [isSpotifyConnected, spotifyLoading, firebaseUser?.uid]);

  // Add a button to manually refresh Spotify connection status
  const handleRefresh = () => {
    console.log("[WebPlaybackTest] Manual refresh triggered");
    refreshSpotifyAuth();
  };

  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // token loading
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadUserToken = async () => {
      if (authLoading || spotifyLoading) return;

      if (!firebaseUser) {
        if (!cancelled) {
          setToken(null);
          setError(null);
          setIsLoading(false);
        }
        return;
      }

      if (!isSpotifyConnected) {
        if (!cancelled) {
          setToken(null);
          setError("Spotify is not connected for this account.");
          setIsLoading(false);
        }
        return;
      }

      try {
        if (!cancelled) {
          setIsLoading(true);
          setError(null);
        }

        const response = await fetch(CLOUD_FN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: firebaseUser.uid }),
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data?.message || "Failed to get Spotify token");

        if (!cancelled) setToken(data.accessToken || null);
      } catch (e) {
        if (!cancelled) {
          setToken(null);
          setError(e?.message || "Unknown error");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadUserToken();
    return () => {
      cancelled = true;
    };
  }, [firebaseUser, authLoading, authError, isSpotifyConnected, spotifyLoading]);

  if (authLoading || spotifyLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔄 Loading...</h2>
        <p>Checking your sign-in status...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h2>❌ Auth Error</h2>
        <p>{String(authError?.message || authError)}</p>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔐 Sign in required</h2>
        <p>Please sign in (Firebase) to test Spotify Web Playback.</p>
      </div>
    );
  }

  // Connect Spotify OAuth handler
  const handleConnectSpotify = () => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const redirectUri = "http://127.0.0.1:5173/callback";
    const scopes = [
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
      "user-modify-playback-state",
      "user-top-read",
      "streaming",
    ].join(" ");
    
    const encodedRedirectUri = encodeURIComponent(redirectUri);
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${encodedRedirectUri}&show_dialog=true`;
    
    window.location.href = authUrl;
  };

  if (!isSpotifyConnected) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🎵 Spotify not connected</h2>
        <p>Please connect your Spotify account first.</p>
        <button
          onClick={handleConnectSpotify}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1DB954",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          🎵 Connect Spotify
        </button>
        <button
          onClick={handleRefresh}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#8B5CF6",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          🔄 Refresh Connection Status
        </button>
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
          Click "Connect Spotify" to authorize, or "Refresh" if you just connected.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>🔄 Loading Spotify Web Playback Test...</h2>
        <p>Getting your Spotify token...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
        <h2>❌ Error Loading Test</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>❌ No Token Available</h2>
        <p>We couldn't retrieve a Spotify token for this user.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>🎧 Spotify Web Playback SDK Test</h1>
      <p><strong>Token Status:</strong> ✅ User Token Available</p>
      <p><strong>Firebase UID:</strong> {firebaseUser.uid}</p>
      <p><strong>Email:</strong> {firebaseUser.email || "Unknown"}</p>
      <p><strong>Note:</strong> This requires Spotify Premium to work properly</p>

      <WebPlayback token={token} />
    </div>
  );
}

export default WebPlaybackTest;
