// src/WebPlayback.jsx
// src/WebPlayback.jsx
import React, { useState, useEffect } from 'react';

const track = {
    name: "",
    album: {
        images: [{ url: "" }]
    },
    artists: [{ name: "" }]
};

function WebPlayback(props) {

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const userId = "exampleUserId";  // Replace with actual user ID logic

    useEffect(() => {
        const script = document.createElement("script"); //The script tag is used to embed a clinet-side script
        script.src = "https://sdk.scdn.co/spotify-player.js"; // The .src atriubute of the script is a pointer to another exteernal script
        script.async = true; // This allows the scrippt to run in the background

        document.body.appendChild(script); // Adds the script to the page so that it loads

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Add listener to handle token expiration, activity of device, and current track
            player.addListener('player_state_changed', async (state) => {
                if (!state) {
                return;
                }

                try {
                    // Check if the token has expired and refresh it
                    console.log('Token expired, refreshing...');
                    const newTokenData = await refreshToken(userId);
                    if (newTokenData) {
                        setToken(newTokenData.accessToken);
                        player._options.getOAuthToken = cb => { cb(newTokenData.accessToken); };
                    }
                } catch (error) {
                    console.error('Error refreshing token:', error);
                }

                // Update the current track and paused state
                setTrack(state.track_window.current_track);
                setPaused(state.paused);

                // Update the active state of the player
                player.getCurrentState().then(state => {
                    setActive(state ? true : false);
                });
            });

            player.connect();
        };
    }, [props.token]);

    return (
        <>
            <div className="container">
                <div className="main-wrapper">
                    <img src={current_track.album.images[0].url} 
                         className="now-playing__cover" alt="" />

                    <div className="now-playing__side">
                        <div className="now-playing__name">{current_track.name}</div>
                        <div className="now-playing__artist">{current_track.artists[0].name}</div>
                    </div>

                    <button className="btn-spotify" onClick={() => { player.previousTrack() }} >
                        &lt;&lt;
                    </button>

                    <button className="btn-spotify" onClick={() => { player.togglePlay() }} >
                        {is_paused ? "PLAY" : "PAUSE"}
                    </button>

                    <button className="btn-spotify" onClick={() => { player.nextTrack() }} >
                        &gt;&gt;
                    </button>
                </div>
            </div>
        </>
    );
}

export default WebPlayback;