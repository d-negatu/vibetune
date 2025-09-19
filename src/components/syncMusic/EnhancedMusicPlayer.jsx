import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './EnhancedMusicPlayer.css';

const EnhancedMusicPlayer = ({ track, onClose }) => {
  const { user } = useAuth();
  const audioRef = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: all, 2: one

  useEffect(() => {
    if (track && audioRef.current) {
      setIsLoading(true);
      setError('');
      
      // Set audio source
      if (track.preview_url) {
        audioRef.current.src = track.preview_url;
      } else {
        setError('Preview not available for this track');
        setIsLoading(false);
      }
    }
  }, [track]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (repeatMode === 2) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      }
    };

    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [repeatMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => (prev + 1) % 3);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSpotifyClick = () => {
    if (track.spotifyUrl) {
      window.open(track.spotifyUrl, '_blank');
    }
  };

  const handleLike = () => {
    // TODO: Implement like functionality
    console.log('Liked track:', track.name);
  };

  const handleShare = () => {
    if (navigator.share && track.spotifyUrl) {
      navigator.share({
        title: `${track.name} by ${track.artist}`,
        text: `Check out this song on Vibetune!`,
        url: track.spotifyUrl
      });
    } else {
      navigator.clipboard.writeText(track.spotifyUrl);
      // TODO: Show toast notification
    }
  };

  if (!track) return null;

  return (
    <div className={`music-player ${isExpanded ? 'expanded' : ''}`}>
      <audio ref={audioRef} preload="metadata" />
      
      {/* Player Header */}
      <div className="player-header">
        <div className="track-info">
          <img src={track.image} alt={track.name} className="track-image" />
          <div className="track-details">
            <h3 className="track-name">{track.name}</h3>
            <p className="track-artist">{track.artist}</p>
          </div>
        </div>
        
        <div className="player-controls-header">
          <button className="control-button" onClick={handleLike}>
            ❤️
          </button>
          <button className="control-button" onClick={handleShare}>
            📤
          </button>
          <button className="control-button" onClick={handleSpotifyClick}>
            🎵
          </button>
          <button className="control-button" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '🔽' : '🔼'}
          </button>
          <button className="control-button close-button" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <span className="time-display">{formatTime(currentTime)}</span>
        <div className="progress-bar" onClick={handleSeek}>
          <div 
            className="progress-fill" 
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />
        </div>
        <span className="time-display">{formatTime(duration)}</span>
      </div>

      {/* Main Controls */}
      <div className="main-controls">
        <button 
          className={`control-button shuffle-button ${isShuffled ? 'active' : ''}`}
          onClick={toggleShuffle}
        >
          🔀
        </button>
        
        <button className="control-button skip-button">
          ⏮️
        </button>
        
        <button 
          className="play-pause-button"
          onClick={togglePlayPause}
          disabled={isLoading || error}
        >
          {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button className="control-button skip-button">
          ⏭️
        </button>
        
        <button 
          className={`control-button repeat-button ${repeatMode > 0 ? 'active' : ''}`}
          onClick={toggleRepeat}
        >
          {repeatMode === 0 ? '🔁' : repeatMode === 1 ? '🔁' : '🔂'}
        </button>
      </div>

      {/* Volume and Additional Controls */}
      <div className="volume-section">
        <button className="control-button" onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        
        <div className="volume-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
        
        <span className="volume-display">{isMuted ? 0 : volume}%</span>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="expanded-controls">
          <div className="playback-rate-controls">
            <label>Playback Speed:</label>
            <div className="rate-buttons">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                <button
                  key={rate}
                  className={`rate-button ${playbackRate === rate ? 'active' : ''}`}
                  onClick={() => setPlaybackRate(rate)}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
          
          <div className="track-metadata">
            <h4>Track Details</h4>
            <p><strong>Album:</strong> {track.album}</p>
            <p><strong>Duration:</strong> {formatTime(duration)}</p>
            <p><strong>Artist:</strong> {track.artist}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>✕</button>
        </div>
      )}
    </div>
  );
};

export default EnhancedMusicPlayer;