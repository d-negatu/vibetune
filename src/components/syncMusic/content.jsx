import React from "react";
import "./content.css";

const Content = () => {
  return (
    <div className="content">
      <h1>Your Playlists</h1>
      <div className="playlist-grid">
        {/* Dummy playlist cards */}
        <div className="playlist-card">Playlist 1</div>
        <div className="playlist-card">Playlist 2</div>
        <div className="playlist-card">Playlist 3</div>
        <div className="playlist-card">Playlist 4</div>
      </div>
    </div>
  );
};

export default Content;
