import React from "react";
import "./VibePage.css";

const mockUsers = [
  {
    id: 1,
    name: "Alice",
    profileImage: "https://randomuser.me/api/portraits/women/1.jpg",
    vibe: "Chill Vibes",
    sharedTracks: ["Lo-fi Beats", "Relaxing Piano", "Acoustic Chill"],
  },
  {
    id: 2,
    name: "Bob",
    profileImage: "https://randomuser.me/api/portraits/men/2.jpg",
    vibe: "Party Mode",
    sharedTracks: ["Dance Hit", "EDM Essentials", "Club Bangers"],
  },
  {
    id: 3,
    name: "Charlie",
    profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
    vibe: "Indie Discoveries",
    sharedTracks: ["Indie Pop", "Hidden Gems", "Bedroom Pop"],
  },
];

const Vibe = () => {
  return (
    <div className="vibe-match-container">
      <h1>VibeMatch</h1>
      <p>Find people who share your musical vibe!</p>
      <div className="vibe-card-list">
        {mockUsers.map((user) => (
          <div className="vibe-card" key={user.id}>
            <img src={user.profileImage} alt={`${user.name}'s profile`} />
            <h2>{user.name}</h2>
            <p><strong>Vibe:</strong> {user.vibe}</p>
            <p><strong>Shared Tracks:</strong></p>
            <ul>
              {user.sharedTracks.map((track, index) => (
                <li key={index}>{track}</li>
              ))}
            </ul>
            <button>Send Vibe Request</button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Vibe;
