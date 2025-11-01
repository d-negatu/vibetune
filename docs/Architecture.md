# VibeTune Architecture

## System Overview

VibeTune is a modern, cloud-native web application built on a serverless architecture using Firebase and Vite.

```
┌─────────────────────────────────────────┐
│         Frontend (Vue.js + Vite)         │
│   ┌──────────────────────────────────┐   │
│   │  UI Components & State Management │   │
│   │  (Pinia Store, Router)           │   │
│   └──────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ REST API / Firebase SDK
               ▼
┌──────────────────────────────────────────┐
│      Firebase Backend Infrastructure     │
│  ┌────────────────────────────────────┐  │
│  │  Authentication (Firebase Auth)    │  │
│  │  - Email/Password, Google OAuth    │  │
│  │  - Session Management              │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Real-time Database (Firestore)    │  │
│  │  - User Preferences                │  │
│  │  - Playlists & Tracks              │  │
│  │  - User Profiles                   │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Cloud Functions                   │  │
│  │  - Recommendations Engine          │  │
│  │  - Playlist Management             │  │
│  │  - User Analytics                  │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Hosting & CDN                     │  │
│  │  - Firebase Hosting                │  │
│  │  - Global CDN Distribution         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│    External Music APIs & Services        │
│  - Spotify API (metadata, playback)      │
│  - YouTube Music (streaming)             │
│  - LastFM (user scrobbling)              │
└──────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **Vite**: Next-generation build tool
- **Pinia**: State management
- **Vue Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase SDK**: Client-side Firebase integration

### Backend
- **Firebase Authentication**: User identity management
- **Cloud Firestore**: NoSQL real-time database
- **Cloud Functions**: Serverless compute
- **Firebase Hosting**: Static site hosting

### External Integrations
- **Spotify API**: Music metadata and recommendations
- **YouTube Data API**: Video content
- **LastFM API**: User scrobbling and statistics

## Project Structure

```
VibeTune/
├── src/
│   ├── components/        # Vue components
│   ├── views/             # Page components
│   ├── stores/            # Pinia stores
│   ├── services/          # Firebase & API services
│   ├── router/            # Vue Router config
│   └── App.vue            # Root component
├── functions/             # Cloud Functions (Node.js)
│   ├── recommendations/   # Recommendation engine
│   ├── playlists/         # Playlist management
│   └── user/              # User data functions
├── public/                # Static assets
├── docs/                  # Documentation
├── firebase.json          # Firebase configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

## Data Model

### Collections

#### Users
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "John Doe",
  "avatar": "url",
  "preferences": {
    "favoriteGenres": ["electronic", "indie"],
    "favoriteArtists": ["Artist1", "Artist2"],
    "moodProfile": "energetic"
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Playlists
```json
{
  "id": "playlist123",
  "userId": "user123",
  "name": "My Favorites",
  "description": "Collection of favorite tracks",
  "tracks": ["track1", "track2"],
  "isPublic": false,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Tracks
```json
{
  "id": "track123",
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "genre": "electronic",
  "duration": 240,
  "spotifyId": "spotify_id",
  "mood": "energetic"
}
```

## Authentication Flow

1. User visits VibeTune
2. Firebase SDK initializes
3. Check if user is authenticated
4. If not authenticated:
   - Redirect to login page
   - User signs up or logs in
   - Firebase generates ID token
   - Token stored in browser storage
5. User is redirected to dashboard
6. All API requests include the ID token

## Recommendation Engine

The recommendation system uses:
- User preference matching
- Collaborative filtering
- Genre and mood analysis
- Play history analysis
- Trending music

## Deployment Pipeline

```
git push
   ↓
GitHub Actions (CI)
   ├─ Lint & Format
   ├─ Unit Tests
   ├─ Build
   └─ Deploy to Firebase
        ↓
   Firebase Hosting
        ↓
   Global CDN
        ↓
   User's Browser
```

## Security

- Firebase Authentication with JWT tokens
- Firestore Security Rules enforce access control
- Cloud Functions validate all requests
- HTTPS enforced for all connections
- Environment variables for sensitive data
- Regular security audits

## Performance Optimization

- Code splitting with dynamic imports
- Lazy loading of components and routes
- Cloud CDN for static asset delivery
- Firestore indexing for fast queries
- Service workers for offline support
- Image optimization and compression

## See Also

- [API Reference](./API.md)
- [Quickstart Guide](./Quickstart.md)
- [Deployment Guide](./Deployment.md)
- [Troubleshooting](./Troubleshooting.md)
