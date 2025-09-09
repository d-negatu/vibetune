import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useAuth } from '../../contexts/AuthContext';
import './musicPlayer.css';

const MusicPlayer = ({ trackData }) => {
  const { user } = useAuth();
  const [player, setPlayer] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(trackData);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const positionInterval = useRef(null);

  // Update currentTrack when trackData prop changes
  useEffect(() => {
    if (trackData) {
      setCurrentTrack(trackData);
    }
  }, [trackData]);

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
        volume: 0.5
      });

      setPlayer(spotifyPlayer);

      // Player ready
      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Spotify Player Ready with Device ID:', device_id);
        setIsActive(true);
        
        // Auto-play "No Time Wasted" track when player is ready
        if (trackData) {
          playTrack(trackData.id);
        }
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
      });

      // Error handlers
      spotifyPlayer.addListener('initialization_error', ({ message }) => {
        console.error('Failed to initialize Spotify Player:', message);
      });

      spotifyPlayer.addListener('authentication_error', ({ message }) => {
        console.error('Failed to authenticate with Spotify:', message);
      });

      spotifyPlayer.addListener('account_error', ({ message }) => {
        console.error('Failed to validate Spotify account:', message);
      });

      spotifyPlayer.addListener('playback_error', ({ message }) => {
        console.error('Failed to perform playback:', message);
      });

      spotifyPlayer.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [user?.accessToken, trackData]);

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

  // Play specific track
  const playTrack = async (trackId) => {
    if (!user?.accessToken || !trackId) return;
    
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [`spotify:track:${trackId}`]
        })
      });
      
      if (response.ok) {
        console.log('Started playing track:', trackId);
      } else {
        console.error('Failed to play track:', response.statusText);
      }
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

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

  const seekTo = (positionMs) => {
    if (player) {
      player.seek(positionMs);
    }
  };

  const progressPercentage = isActive && duration > 0 ? (position / duration) * 100 : (trackData ? 40 : 0);

  // Show player if we have track data OR if Web Playback is active
  if (!currentTrack && !trackData) {
    return null;
  }

  return (
    <div className="music-player">
      <div className="track-info" onClick={isActive ? togglePlay : () => trackData && playTrack(trackData.id)}>
        <img 
          className="album-art" 
          src={(currentTrack || trackData)?.album?.images?.[0]?.url || '/default-album-art.jpg'} 
          alt="Album Art" 
        />
        <div className="track-details">
          <span className="track-name">{(currentTrack || trackData)?.name || 'No track playing'}</span>
          <span className="artist-name">
            {(currentTrack || trackData)?.artists?.map(artist => artist.name).join(", ") || 'Unknown Artist'}
          </span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <div className="player-controls">
        {isActive ? (
          <>
            <button className="control-btn" onClick={previousTrack} title="Previous">
              <Icon icon="material-symbols:skip-previous" />
            </button>
            <button className="control-btn play-pause" onClick={togglePlay} title={isPaused ? 'Play' : 'Pause'}>
              <Icon icon={isPaused ? "material-symbols:play-arrow" : "material-symbols:pause"} />
            </button>
            <button className="control-btn" onClick={nextTrack} title="Next">
              <Icon icon="material-symbols:skip-next" />
            </button>
          </>
        ) : (
          <button 
            className="control-btn play-pause" 
            onClick={() => trackData && playTrack(trackData.id)} 
            title="Play Track"
          >
            <Icon icon="material-symbols:play-arrow" />
          </button>
        )}
      </div>

      <div 
        className="progress-bar-container"
        onClick={isActive ? (e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newPosition = (clickX / rect.width) * duration;
          seekTo(newPosition);
        } : undefined}
      >
        <div className="progress-bar-background">
          <div
            className="progress-bar-playback"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;