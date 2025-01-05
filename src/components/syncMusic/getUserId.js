import { getSpotifyToken } from "./spotfiyToken";

export async function getUserId(accessToken) {

 
    const response = await fetch('https://api.spotify.com/v1/me/', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });

    const data = await response.json();
    //console.log(data);
    
    // Return the user ID instead of logging it
    return data.id;
}
