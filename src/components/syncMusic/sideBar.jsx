import React from "react";
import "./sideBar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Spotify</h2>
      <ul>
        <li>Home</li>
        <li>Search</li>
        <li>Your Library</li>
        <hr />
        <li>Create Playlist</li>
        <li>Liked Songs</li>
      </ul>
    </div>
  );
};

export default Sidebar;
