// src/WebPlayback.jsx
import React, { useState, useEffect } from 'react';

// Default track structure
const defaultTrack = {
    name: "No track selected",
    album: {
        images: [{ url: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzFkYjk1NCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gVHJhY2s8L3RleHQ+PC9zdmc+" }]
    },
    artists: [{ name: "Unknown Artist" }]
};

function WebPlayback(props) {
    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(defaultTrack);
    const [is_loading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [device_id, setDeviceId] = useState(null);

    useEffect(() => {
        if (!props.token) {
            setError('No Spotify token provided');
            setIsLoading(false);
            return;
        }

        console.log('🎧 Initializing Spotify Web Playback SDK...');
        setIsLoading(true);
        setError(null);

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            console.log('✅ Spotify Web Playback SDK Ready');
            
            const player = new window.Spotify.Player({
                name: 'Vibetune Web Player',
                getOAuthToken: cb => { 
                    console.log('🔑 Providing token to Spotify SDK');
                    cb(props.token); 
                },
                volume: 0.5
            });

            setPlayer(player);

            // Player ready
            player.addListener('ready', ({ device_id }) => {
                console.log('🎵 Spotify Player Ready with Device ID:', device_id);
                setDeviceId(device_id);
                setActive(true);
                setIsLoading(false);
            });

            // Player not ready
            player.addListener('not_ready', ({ device_id }) => {
                console.log('❌ Spotify Player not ready:', device_id);
                setActive(false);
                setIsLoading(false);
            });

            // Player state changed
            player.addListener('player_state_changed', (state) => {
                if (!state) {
                    console.log('No player state available');
                    return;
                }

                console.log('🎵 Player state changed:', {
                    paused: state.paused,
                    track: state.track_window?.current_track?.name || 'No track'
                });

                // Update the current track and paused state
                if (state.track_window?.current_track) {
                    setTrack(state.track_window.current_track);
                }
                setPaused(state.paused);

                // Update the active state of the player
                player.getCurrentState().then(state => {
                    setActive(state ? true : false);
                });
            });

            // Error handlers
            player.addListener('initialization_error', ({ message }) => {
                console.error('❌ Spotify Player initialization error:', message);
                setError(`Initialization error: ${message}`);
                setIsLoading(false);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error('❌ Spotify Player authentication error:', message);
                setError(`Authentication error: ${message}`);
                setIsLoading(false);
            });

            player.addListener('playback_error', ({ message }) => {
                console.error('❌ Spotify Player playback error:', message);
                setError(`Playback error: ${message}`);
            });

            console.log('🔌 Connecting to Spotify...');
            player.connect();
        };

        // Cleanup function
        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, [props.token]);

    // Helper function to play a specific track
    const playTrack = async (trackUri) => {
        if (!player || !device_id) {
            console.error('Player or device ID not available');
            return;
        }

        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${props.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uris: [trackUri]
                })
            });

            if (response.ok) {
                console.log('✅ Track playback started');
            } else {
                console.error('❌ Failed to start playback:', response.status);
            }
        } catch (error) {
            console.error('❌ Error starting playback:', error);
        }
    };

    return (
        <div className="web-playback-container">
            <h3>🎧 Spotify Web Playback SDK Test</h3>
            
            {is_loading && (
                <div className="loading-state">
                    <p>🔄 Loading Spotify Web Playback SDK...</p>
                </div>
            )}

            {error && (
                <div className="error-state">
                    <p>❌ Error: {error}</p>
                </div>
            )}

            {!is_loading && !error && (
                <div className="player-info">
                    <p><strong>Device ID:</strong> {device_id || 'Not connected'}</p>
                    <p><strong>Status:</strong> {is_active ? '✅ Active' : '❌ Inactive'}</p>
                </div>
            )}

            <div className="container">
                <div className="main-wrapper">
                    <img 
                        src={current_track.album.images[0]?.url || defaultTrack.album.images[0].url} 
                        className="now-playing__cover" 
                        alt="Track cover" 
                    />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0]?.name || 'Unknown Artist'}</div>
                    </div>

                    <div className="player-controls">
                        <button 
                            className="btn-spotify" 
                            onClick={() => player?.previousTrack()} 
                            disabled={!player || !is_active}
                        >
                            ⏮️
                        </button>

                        <button 
                            className="btn-spotify" 
                            onClick={() => player?.togglePlay()} 
                            disabled={!player || !is_active}
                        >
                            {is_paused ? "▶️" : "⏸️"}
                        </button>

                        <button 
                            className="btn-spotify" 
                            onClick={() => player?.nextTrack()} 
                            disabled={!player || !is_active}
                        >
                            ⏭️
                        </button>
                    </div>
                </div>
            </div>

            {/* Test track buttons */}
            <div className="test-tracks">
                <h4>Test Tracks:</h4>
                <button 
                    onClick={() => playTrack('spotify:track:4iV5W9uYEdYUVa79Axb7Rh')}
                    disabled={!player || !is_active}
                >
                    Play "Never Gonna Give You Up"
                </button>
                <button 
                    onClick={() => playTrack('spotify:track:7qiZfU4dY1lWllzX7mPBI3')}
                    disabled={!player || !is_active}
                >
                    Play "Shape of You"
                </button>
            </div>
        </div>
    );
}

export default WebPlayback;