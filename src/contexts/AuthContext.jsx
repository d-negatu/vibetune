/**
 * @deprecated This is a compatibility wrapper for SpotifyAuthContext.
 * It's a small file in the codebasse tht re-exports the useSpotifyAuth context.
 */
import { useSpotifyAuth } from './SpotifyAuthContext';

// Re-export for backward compatibility
export const useAuth = () => {
  const spotifyAuth = useSpotifyAuth();
  // Return in the old format for compatibility
  return {
    isAuthenticated: spotifyAuth.isAuthenticated,
    user: spotifyAuth.user,
    loading: spotifyAuth.loading,
    login: spotifyAuth.login,
    logout: spotifyAuth.logout,
  };
};

// AuthProvider is no longer needed since SpotifyAuthProvider is in main.jsx
// But we export a no-op component for compatibility
export const AuthProvider = ({ children }) => {
  // This is a no-op - the actual provider is in main.jsx
  return <>{children}</>;
};
