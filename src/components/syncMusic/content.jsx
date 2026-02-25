import React from "react";
import "./content.css";

const Content = () => {
  return (
    <div className="content">
      <h1>Your Library</h1>
      <p className="content-subtitle">Playlists and saved music from Spotify will appear here when connected.</p>
      <div className="playlist-grid">
        <div className="playlist-card playlist-card--placeholder">Your playlists</div>
        <div className="playlist-card playlist-card--placeholder">Liked songs</div>
        <div className="playlist-card playlist-card--placeholder">Create playlist</div>
      </div>
    </div>
  );
};

export default Content;
