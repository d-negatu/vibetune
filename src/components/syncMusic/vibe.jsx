// src/components/Vibe.jsx

import React from 'react';
import './vibe.css'; // Import the CSS file for styling

// Mock data for posts
const mockPosts = [
    {
        id: 1,
        username: 'user1',
        profilePic: 'https://via.placeholder.com/50',
        musicCover: 'https://via.placeholder.com/300',
        musicTitle: 'Song Title 1',
        artist: 'Artist 1',
        timePosted: '2 hours ago'
    },
    {
        id: 2,
        username: 'user2',
        profilePic: 'https://via.placeholder.com/50',
        musicCover: 'https://via.placeholder.com/300',
        musicTitle: 'Song Title 2',
        artist: 'Artist 2',
        timePosted: '3 hours ago'
    }
];

const Vibe = () => {
    return (
        <div className="vibe-page">
            {mockPosts.map(post => (
                <div key={post.id} className="vibe-post">
                    <div className="vibe-header">
                        <img src={post.profilePic} alt="Profile" className="profile-pic" />
                        <div className="vibe-user-info">
                            <span className="username">{post.username}</span>
                            <span className="time-posted">{post.timePosted}</span>
                        </div>
                    </div>
                    <img src={post.musicCover} alt="Music Cover" className="music-cover" />
                    <div className="vibe-footer">
                        <span className="music-title">{post.musicTitle}</span>
                        <span className="artist">{post.artist}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Vibe;