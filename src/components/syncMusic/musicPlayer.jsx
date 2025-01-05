import React from 'react';
import './musicPlayer.css'; // Import the CSS file for styling

const MusicPlayer = ({ trackData }) => {
  return (
    <div className="music-player">
      <div className="track-info">
        <img className="album-art" src={trackData?.album?.images?.[0]?.url || 'path-to-default-album-art.jpg'} alt="Album Art" />
        <div className="track-details">
          <span className="track-name">{trackData?.name || 'Track Name'}</span>
          <span className="artist-name">{trackData?.artists?.map(artist => artist.name).join(", ") || 'Artist Name'}</span>
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-background">
          <div
            className="progress-bar-playback"
            style={{ width: `${trackData ? 40 : 0}%` }} // Example progress
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;