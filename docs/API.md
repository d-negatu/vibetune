# VibeTune API Reference

## Overview

VibeTune exposes a comprehensive REST API and Firebase Cloud Functions for music recommendation, playlist management, and user preference tracking.

## Base URL

```
https://vibetune-app.web.app/api
```

## Authentication

All API requests require Firebase Authentication. Include the Firebase ID token in request headers:

```
Authorization: Bearer <firebase_id_token>
```

## Endpoints

### Recommendations

#### Get Recommendations

```http
GET /api/recommendations
```

**Query Parameters:**
- `genre` (string): Music genre filter
- `mood` (string): Mood filter (happy, sad, energetic, calm)
- `limit` (number): Maximum results (default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "track_001",
      "title": "Song Title",
      "artist": "Artist Name",
      "genre": "electronic",
      "mood": "energetic",
      "duration": 240
    }
  ]
}
```

### Playlists

#### Create Playlist

```http
POST /api/playlists
```

**Request Body:**
```json
{
  "name": "My Playlist",
  "description": "A curated collection",
  "isPublic": false
}
```

#### Get User Playlists

```http
GET /api/playlists
```

#### Add Track to Playlist

```http
POST /api/playlists/:playlistId/tracks
```

**Request Body:**
```json
{
  "trackId": "track_001"
}
```

### User Preferences

#### Update Preferences

```http
POST /api/preferences
```

**Request Body:**
```json
{
  "favoriteGenres": ["electronic", "indie"],
  "favoriteArtists": ["Artist 1", "Artist 2"],
  "moodProfile": "energetic"
}
```

## Error Handling

API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## Rate Limiting

- 1000 requests per hour per user
- 429 Too Many Requests when exceeded

## See Also

- [Quickstart Guide](./Quickstart.md)
- [Architecture](./Architecture.md)
- [Troubleshooting](./Troubleshooting.md)
