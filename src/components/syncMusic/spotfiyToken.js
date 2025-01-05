let cachedToken = null;
let tokenExpiryTime = null;

export async function getSpotifyToken(clientId, clientSecret) {

  const currentTime = Date.now();

  // Reuse the cached token if it's still valid
  if (cachedToken ) {
    return cachedToken;
  }

  // Fetch a new token if no valid cached token exists
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Spotify token");
  }

  const data = await response.json();
  cachedToken = data.access_token;
  tokenExpiryTime = currentTime + data.expires_in * 1000; // Cache the expiry time
  return cachedToken;
}
