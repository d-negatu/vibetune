import React, { useState } from 'react';
import { useFirebaseAuth } from '../contexts/FirebaseAuthContext';

const FirebaseAuthTest = () => {
  const { user, loading, signUp, signIn, logout } = useFirebaseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        await signUp(email, password);
        setSuccess('Account created successfully!');
      } else {
        await signIn(email, password);
        setSuccess('Signed in successfully!');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setSuccess('Signed out successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔄 Loading Firebase Auth...</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1>🔥 Firebase Auth Test</h1>
      
      {user ? (
        <div>
          <h2>✅ User Signed In</h2>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
          <p><strong>Email Verified:</strong> {user.emailVerified ? 'Yes' : 'No'}</p>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
            </div>
            
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>
          
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Switch to {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          border: '1px solid #ffcdd2',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {success && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#e8f5e8',
          color: '#2e7d32',
          border: '1px solid #c8e6c9',
          borderRadius: '4px'
        }}>
          <strong>Success:</strong> {success}
        </div>
      )}
    </div>
  );
};

export default FirebaseAuthTest;



