import React, { useEffect, useState } from "react";
import { getSpotifyToken } from "./spotfiyToken";


const SpotifyTrack = ({ setTrackData }) => {
    
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;

    console.log("Spotify Client ID:", clientId);
    console.log("Spotify Client Secret:", clientSecret);


    const trackId = "4MUlNqSrMeFAHA6VpJKMo8"; // Example track ID, replace with your own

    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTrack = async () => {
            try {
                // Step 1: Get Spotify Access Token
                const token = await getSpotifyToken(clientId, clientSecret);
                
                // Step 2: Fetch Track Data
                const trackResponse = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!trackResponse.ok) {
                    throw new Error(`Error fetching track data: ${trackResponse.statusText}`);
                }

                const trackData = await trackResponse.json();
                setTrackData(trackData);
                
            } catch (error) {
                setError(error.message);
                console.error("Error fetching track:", error);
            }
        };

        fetchTrack();
    }, [clientId, clientSecret, trackId, setTrackData]);

    return (
        <div>
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
        </div>
    );
};

export default SpotifyTrack;