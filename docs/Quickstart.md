# VibeTune Quickstart Guide

## 5-Minute Setup

### Prerequisites
- Node.js 16+
- npm or yarn
- Firebase account (free tier supported)

### Installation

```bash
# Clone the repository
git clone https://github.com/d-negatu/VibeTune.git
cd VibeTune

# Install dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools
```

### Configure Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if needed)
firebase init
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Locally

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Deploy to Firebase

```bash
# Build for production
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## First Steps

1. **Sign Up**: Create an account via the authentication UI
2. **Set Preferences**: Choose your favorite genres and artists
3. **Get Recommendations**: Browse personalized music recommendations
4. **Create Playlists**: Build custom playlists from recommendations
5. **Share**: Share playlists with friends

## Common Tasks

### Find Music by Genre
```javascript
import { getRecommendations } from './functions/recommendations';

const tracks = await getRecommendations({
  genre: 'electronic',
  limit: 10
});
```

### Create a Playlist
```javascript
import { createPlaylist } from './functions/playlists';

const playlist = await createPlaylist({
  name: 'My Favorites',
  description: 'Tracks I love',
  isPublic: false
});
```

### Update User Preferences
```javascript
import { updateUserPreferences } from './functions/user';

await updateUserPreferences({
  favoriteGenres: ['electronic', 'indie', 'pop'],
  moodProfile: 'energetic'
});
```

## Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 5174
```

**Firebase credentials not working?**
- Verify `.env` file has correct values
- Check Firebase project settings
- Ensure APIs are enabled in Firebase Console

**Build fails?**
```bash
rm -rf node_modules
npm install
npm run build
```

## Next Steps

- Read the [API Reference](./API.md)
- Explore the [Architecture](./Architecture.md)
- Check [Deployment Guide](./Deployment.md)
- Review [Troubleshooting](./Troubleshooting.md)

## Get Help

- Open an [issue](../../issues)
- Check [discussions](../../discussions)
- Read [Security Policy](../SECURITY.md)
