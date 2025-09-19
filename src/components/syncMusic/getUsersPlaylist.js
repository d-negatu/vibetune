import { getUserId } from "./getUserId";
import { getSpotifyToken} from "./spotfiyToken";

export async function getPlaylists(accessToken) {
    
    const clientId = "0f1ee9de998e44a992767466ac7619db"; // Replace with your client ID
    const clientSecret = "6cea239f00a244d9ab2160cc61bf5557"; // Replace with your client secret

    // Step 1: Get Spotify Access Token
    const token = await getSpotifyToken(clientId, clientSecret);

    //Step 2: Get Spotify User Id
    const userId = await getUserId(token);

    const response = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    //console.log(data); // This will contain the user's playlists
}

// Default export for compatibility
export default { getPlaylists };