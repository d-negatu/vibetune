import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import './EnhancedMusicPlayer.css';

const EnhancedMusicPlayer = () => {
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: context, 2: track
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const positionInterval = useRef(null);

  // Initialize Spotify Web Playback SDK
  useEffect(() => {
    if (!user?.accessToken) return;

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'VibeTune Player',
        getOAuthToken: cb => {
          cb(user.accessToken);
        },
        volume: volume / 100
      });

      setPlayer(spotifyPlayer);

      // Player ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with Device ID:', device_id);
        setIsActive(true);
        setIsLoading(false);
      });

      // Player not ready
      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
        setIsActive(false);
      });

      // Player state changed
      spotifyPlayer.addListener('player_state_changed', (state) => {
        if (!state) return;

        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
        setPosition(state.position);
        setDuration(state.duration);
        setIsShuffled(state.shuffle);
        setRepeatMode(state.repeat_mode);
      });

      // Initialization error
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize Spotify Player:', message);
        setIsLoading(false);
      });

      // Authentication error
      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate with Spotify:', message);
        setIsLoading(false);
      });

      // Account error
      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
        setIsLoading(false);
      });

      // Playback error
      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
      });

      spotifyPlayer.connect();
      setIsLoading(true);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [user?.accessToken]);

  // Update position every second
  useEffect(() => {
    if (isActive && !isPaused) {
      positionInterval.current = setInterval(() => {
        setPosition(prev => prev + 1000);
      }, 1000);
    } else {
      clearInterval(positionInterval.current);
    }

    return () => clearInterval(positionInterval.current);
  }, [isActive, isPaused]);

  // Player controls
  const togglePlay = () => {
    if (player) {
      player.togglePlay();
    }
  };

  const previousTrack = () => {
    if (player) {
      player.previousTrack();
    }
  };

  const nextTrack = () => {
    if (player) {
      player.nextTrack();
    }
  };

  const setVolumeLevel = (newVolume) => {
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume / 100);
    }
  };

  const toggleShuffle = () => {
    if (player) {
      player.setShuffle(!isShuffled);
    }
  };

  const toggleRepeat = () => {
    if (player) {
      const newRepeatMode = (repeatMode + 1) % 3;
      player.setRepeat(newRepeatMode);
    }
  };

  const seekTo = (positionMs) => {
    if (player) {
      player.seek(positionMs);
    }
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  if (!isActive && !isLoading) {
    return null; // Don't show player if not connected
  }

  if (isLoading) {
    return (
      <div className="enhanced-music-player loading">
        <div className="player-content">
          <div className="loading-spinner"></div>
          <span>Connecting to Spotify...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`enhanced-music-player ${isExpanded ? 'expanded' : ''}`}>
      {/* Progress Bar */}
      <div className="progress-bar-container">
        <div 
          className="progress-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const newPosition = (clickX / rect.width) * duration;
            seekTo(newPosition);
          }}
        >
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="player-content">
        {/* Track Info */}
        <div className="track-info" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="album-art">
            {currentTrack?.album?.images?.[0]?.url ? (
              <img 
                src={currentTrack.album.images[0].url} 
                alt={currentTrack.name}
              />
            ) : (
              <div className="default-art">
                <Icon icon="material-symbols:music-note" />
              </div>
            )}
          </div>
          <div className="track-details">
            <div className="track-name">
              {currentTrack?.name || 'No track playing'}
            </div>
            <div className="artist-name">
              {currentTrack?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="player-controls">
          <button 
            className={`control-btn shuffle ${isShuffled ? 'active' : ''}`}
            onClick={toggleShuffle}
            title="Shuffle"
          >
            <Icon icon="material-symbols:shuffle" />
          </button>

          <button 
            className="control-btn previous"
            onClick={previousTrack}
            title="Previous"
          >
            <Icon icon="material-symbols:skip-previous" />
          </button>

          <button 
            className="control-btn play-pause"
            onClick={togglePlay}
            title={isPaused ? 'Play' : 'Pause'}
          >
            <Icon icon={isPaused ? "material-symbols:play-arrow" : "material-symbols:pause"} />
          </button>

          <button 
            className="control-btn next"
            onClick={nextTrack}
            title="Next"
          >
            <Icon icon="material-symbols:skip-next" />
          </button>

          <button 
            className={`control-btn repeat ${repeatMode > 0 ? 'active' : ''}`}
            onClick={toggleRepeat}
            title={repeatMode === 0 ? 'Repeat Off' : repeatMode === 1 ? 'Repeat All' : 'Repeat One'}
          >
            <Icon icon={repeatMode === 2 ? "material-symbols:repeat-one" : "material-symbols:repeat"} />
          </button>
        </div>

        {/* Time and Volume */}
        <div className="player-info">
          <div className="time-display">
            <span>{formatTime(position)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          
          <div className="volume-control">
            <Icon icon="material-symbols:volume-down" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolumeLevel(parseInt(e.target.value))}
              className="volume-slider"
            />
            <Icon icon="material-symbols:volume-up" />
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="expanded-view">
          <div className="expanded-album-art">
            {currentTrack?.album?.images?.[0]?.url ? (
              <img 
                src={currentTrack.album.images[0].url} 
                alt={currentTrack.name}
              />
            ) : (
              <div className="default-art-large">
                <Icon icon="material-symbols:music-note" />
              </div>
            )}
          </div>
          <div className="expanded-track-info">
            <h3>{currentTrack?.name || 'No track playing'}</h3>
            <p>{currentTrack?.artists?.map(artist => artist.name).join(', ') || 'Unknown Artist'}</p>
            <p className="album-name">{currentTrack?.album?.name || ''}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMusicPlayer;
