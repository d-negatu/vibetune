import React, { useEffect, useState } from "react";
import { getSpotifyToken} from "./spotfiyToken";
import { getUserId } from "./getUserId";

const SpotifyPlaylists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlaylists = async () => {
   
    try {
      

        // Step 1: Get Spotify Access Token
        //const token = await getSpotifyToken(clientId, clientSecret);

        const token = "BQD7SGQgrQG_LkIyZmvU-y_DVhrrow8pLdoZfE5LcItrHkFkz4pbYC1D8vVsP3Bjo1H09vLqxntuv2L4UADe-on1A0KIsSXGv4jrCJpiIoNhDStix-d_juG21K4T0uMpixKTZsc9YBTVj7NyI9rErFJ9uA0TOkHZgV-ax-lg-rtLbIQl3sbYwB7DkKOMMzMIHPTlyzRtgh9kGpAareekMeLVUa7wDJ1yrpgt-suv"
    
        //Step 2: Get Spotify User Id
        const userId = await getUserId(token);

        console.log(userId);

        console.log("hello");


      // Step 2: Fetch playlists
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }

      const data = await response.json();
      setPlaylists(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  if (isLoading) return <p>Loading playlists...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Your Spotify Playlists</h1>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <a href={playlist.external_urls.spotify} target="_blank" rel="noopener noreferrer">
              {playlist.name}
            </a>
            <p>{playlist.tracks.total} tracks</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SpotifyPlaylists;
