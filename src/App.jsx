import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Still needed for other components
import { UserProfileProvider, useUserProfile } from './contexts/UserProfileContext';
import { FirebaseAuthProvider, useFirebaseAuth } from './contexts/FirebaseAuthContext';
import './App.css';

// Import components
import LoginPage from './components/syncMusic/loginPage';
import SignupPage from './components/syncMusic/signupPage';
import CallbackPage from './components/syncMusic/callback';
import ProfileSetup from './components/syncMusic/ProfileSetup';
import VibePage from './components/syncMusic/vibePage';
import Dashboard from './components/syncMusic/dashboard';
import UserProfile from './components/syncMusic/userProfile';
import WebPlaybackTest from './components/syncMusic/webPlaybackTest';
import FirebaseAuthTest from './components/FirebaseAuthTest';

// Loading component
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh',
    background: '#1B1A1A',
    color: '#FFFFFF',
    fontFamily: 'Poppins, sans-serif'
  }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      border: '4px solid rgba(139, 92, 246, 0.3)', 
      borderTop: '4px solid #8B5CF6', 
      borderRadius: '50%', 
      animation: 'spin 1s linear infinite',
      marginBottom: '20px'
    }}></div>
    <h2>Loading Vibetune...</h2>
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const { user, loading: firebaseLoading } = useFirebaseAuth();

  // Wait for Firebase auth to initialize
  if (firebaseLoading || profileLoading) {
    return <LoadingScreen />;
  }

  // Check authentication - only use Firebase Auth
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs profile setup (only if profile exists and isn't completed)
  if (userProfile && !userProfile.profileCompleted) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
};

// Public Route component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { userProfile, loading: profileLoading } = useUserProfile();
  const { user, loading: firebaseLoading } = useFirebaseAuth();

  // Wait for Firebase auth to initialize
  if (firebaseLoading || profileLoading) {
    return <LoadingScreen />;
  }

  // If user is authenticated and profile is completed, redirect to home
  // Allow access to login/signup if profile is not completed (they need to finish setup)
  if (user && userProfile && userProfile.profileCompleted) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Routes
const AppRoutes = () => {
  // Note: navigate is not available here, ProfileSetup will handle its own navigation
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/signup" element={
        <PublicRoute>
          <SignupPage />
        </PublicRoute>
      } />
      <Route path="/callback" element={<CallbackPage />} />
      
      {/* Protected Routes */}
      <Route path="/profile-setup" element={
        <ProtectedRoute>
          <ProfileSetup />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      <Route path="/" element={
        <ProtectedRoute>
          <VibePage />
        </ProtectedRoute>
      } />
      
      {/* Test Route for WebPlayback */}
      <Route path="/test-webplayback" element={
        <ProtectedRoute>
          <WebPlaybackTest />
        </ProtectedRoute>
      } />
      
      {/* Test Route for Firebase Auth */}
      <Route path="/test-firebase-auth" element={<FirebaseAuthTest />} />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
function App() {
  return (
    <FirebaseAuthProvider>
      <AuthProvider>
        <UserProfileProvider>
          <div className="App">
            <AppRoutes />
          </div>
        </UserProfileProvider>
      </AuthProvider>
    </FirebaseAuthProvider>
  );
}

export default App;