/**
 * LoginPage.jsx
 * 
 * This component is responsible for handling user login to Spotify through
 * Auth2 authorization.The user is redirected to Spotify's login page where
 * they are prompted to authenticate and grant necessary permissions.
 * After a successful login, the user is redirected to the provided callback
 * URI with an access token in the URL fragment.
 * 
 * @module LoginPage
 */


// Client ID and redirect URI should be obtained from Spotify Developer Dashboard
// These values are necessary for OAuth2 authentication flow.
import React, { useEffect, useState } from "react";
// import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import './loginPage.css'; // Import your CSS file for styling

const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// Redirect URI to your application (must match what is configured in Spotify Dashboard)
const redirectUri = "http://localhost:5173/callback"; 

const scopes = [
    "user-read-private",//permission to access user's private data (e.g., username)
    "user-read-email", // permission to access user's email address
    "user-read-playback-state", // permission to read the current playback state
    "user-modify-playback-state", // Grants permission to control playback
    "user-top-read",       
    "streaming",// Grants permission to stream music
].join("%20"); // Encode spaces as %20



/**
 * handleLogin function
 * 
 * This function constructs the authorization URL for Spotify's OAuth2 flow 
 * and redirects the user to the Spotify login page. The user is required to
 * log in and authorize the application with the requested permissions.
 * Once authorized, Spotify redirects the user back to the callback
 * URI with an access token.
 * 
 * @function
 */

const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&show_dialog=true`;
    console.log("Redirecting to:", authUrl);
    window.location.href = authUrl; // Redirect user to Spotify login page
};



/**
 * LoginPage Component
 * 
 * The LoginPage component renders a simple UI with a title and a login button.
 * When the button is clicked, the handleLogin function is invoked to initiate
 * the OAuth2 flow.
 * 
 * @component
 */


const LoginPage = () => {
    const { user, logout, login } = useAuth();
    const { login: firebaseLogin, user: firebaseUser, loading: firebaseLoading } = useFirebaseAuth();
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Check if user is already logged in
    useEffect(() => {
        if (user || firebaseUser) {
            // User is already logged in, redirect to dashboard or vibe page
            window.location.href = '/vibe';
        }
    }, [user, firebaseUser]);

    // Initialize particles when component mounts
    useEffect(() => {
        // Wait for particles.js to be available
        const initParticles = () => {
            if (window.particlesJS) {
                window.particlesJS.load('particles-js', '/particles.json', function() {
                    console.log('Particles.js loaded successfully');
                });
            } else {
                // Retry after a short delay if particles.js isn't loaded yet
                setTimeout(initParticles, 100);
            }
        };

        initParticles();

        // Cleanup function to destroy particles when component unmounts
        return () => {
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
                window.pJSDom[0].pJS.fn.vendors.densityAutoParticles();
            }
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        
        try {
            // Use Firebase Auth to sign in
            const firebaseUser = await firebaseLogin(formData.email, formData.password);
            
            // Create user data for the auth context
            const userData = {
                uid: firebaseUser.uid,
                userId: firebaseUser.uid, // Map uid to userId for compatibility
                email: firebaseUser.email,
                username: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                profileCompleted: true // Assume profile is completed for existing users
            };
            
            // Login the user using the existing auth context
            login(userData);
            
            // Redirect to main app
            window.location.href = '/vibe';
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle Firebase Auth specific error messages
            let errorMessage = 'Login failed. Please try again.';
            
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please sign up first.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/user-disabled') {
                errorMessage = 'This account has been disabled. Please contact support.';
            } else if (error.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            setErrors({ general: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div id="particles-js"></div>
            <div className="login-container">
                <div className="logo-icon">🎵</div>
                <h1 className="brand-title">Sign in to Vibetune</h1>
                
                <div className="auth-options">
                    <button className="auth-button spotify" onClick={handleLogin}>
                        <span className="auth-icon">🎵</span>
                        <span>Continue with Spotify</span>
                    </button>
                    
                    <button className="auth-button google">
                        <span className="auth-icon">🔍</span>
                        <span>Continue with Google</span>
                    </button>
                    
                    <button className="auth-button apple">
                        <span className="auth-icon">🍎</span>
                        <span>Continue with Apple</span>
                    </button>
                </div>
                
                <div className="divider">
                    <span>or</span>
                </div>
                
                {errors.general && (
                    <div className="error-message general-error">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="manual-login">
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
                    <button 
                        type="submit" 
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-icon">⏳</span>
                                Signing In...
                            </>
                        ) : (
                            <span>Log In</span>
                        )}
                    </button>
                </form>
                
                <div className="footer">
                    <a href="#" className="forgot-password">Forgot your password?</a>
                    <div className="signup-link">
                        <span>Don't have an account? </span>
                        <a href="/signup" className="signup-text">Sign up for Vibetune</a>
                    </div>
                </div>
            </div>
            
            <div className="content-section">
                <div className="content-container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">10K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">1M+</div>
                            <div className="stat-label">Songs Shared</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Playlists Created</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="footer-section">
                <div className="content-container">
                    <div className="footer-content">
                        <div className="footer-links">
                            <a href="#" className="footer-link">Privacy Policy</a>
                            <a href="#" className="footer-link">Terms of Service</a>
                            <a href="#" className="footer-link">Support</a>
                            <a href="#" className="footer-link">About</a>
                        </div>
                        <div className="footer-copyright">
                            <p>&copy; 2024 Vibetune. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the LoginPage component as the default export of this module
export default LoginPage;
