import React, { useEffect, useState } from "react";
import { getSpotifyToken } from "./spotfiyToken";

const SpotifyTokenTester = () => {
    const clientId = "0f1ee9de998e44a992767466ac7619db"; 
    const clientSecret = "6cea239f00a244d9ab2160cc61bf5557"; 
    const artistId = "0TnOYISbd1XYRBk9myaseg"; 

    const [artistData, setArtistData] = useState(null);
    const [topTracks, setTopTracks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchArtistAndTracks = async () => {
            try {
                // Step 1: Get Spotify Access Token
                const token = await getSpotifyToken(clientId, clientSecret);

                // Step 2: Fetch Artist Data
                const artistResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!artistResponse.ok) {
                    throw new Error(`Error fetching artist data: ${artistResponse.statusText}`);
                }

                const artistData = await artistResponse.json();
                setArtistData(artistData);

                const topTracksResponse = await fetch(
                    `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                

            if (!topTracksResponse.ok) {
                throw new Error(`Error fetching top tracks: ${topTracksResponse.statusText}`);
            }

            const topTracksData = await topTracksResponse.json();

            setTopTracks(topTracksData.tracks);   


            } catch (error) {
                setError(error.message);
                console.error("Error fetching artist or tracks:", error);
            }
        };

        fetchArtistAndTracks();

    }, []);

    return (
        <div>
            <h1>Spotify Artist and Top Tracks</h1>
            {error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <>
                    {artistData && (
                        <div>
                            <h2>{artistData.name}</h2>
                            <p>Genre(s): {artistData.genres.join(", ")}</p>
                            <p>Popularity: {artistData.popularity}</p>
                            <img
                                src={artistData.images?.[0]?.url}
                                alt={`${artistData.name}'s image`}
                                style={{ width: "300px" }}
                            />
                        </div>
                    )}


                    {topTracks.length > 0 && (
                        <div>
                            <h3>Top Tracks</h3>
                            <ul>
                                {topTracks.map((track) => (
                                    <li key={track.id}>
                                        <p><strong>{track.name}</strong></p>
                                        <audio controls>
                                            <source src={track.preview_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                   
                </>
            )}
        </div>
    );
};

export default SpotifyTokenTester;
