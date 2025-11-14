# VibeTune Deployment Guide

## Deployment Platforms

VibeTune can be deployed to multiple platforms. This guide covers Firebase Hosting (recommended), Vercel, and Netlify.

## Firebase Hosting (Recommended)

### Prerequisites
- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project created
- Admin access to the project

### Step 1: Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Step 2: Deploy to Firebase

```bash
firebase deploy
```

Or deploy specific resources:

```bash
# Deploy only hosting
firebase deploy --only hosting

# Deploy only functions
firebase deploy --only functions

# Deploy both
firebase deploy
```

### Step 3: View Your Deployment

```bash
firebase open hosting:site
```

Your app is now live at `https://your-project.web.app`

## Environment Variables

Set environment variables in your `.env.production` file:

```env
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_FIREBASE_STORAGE_BUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

These will be embedded in your build and available to the browser.

## Cloud Functions Deployment

### Deploy Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Function Configuration

Edit `firebase.json` to configure function settings:

```json
{
  "functions": {
    "source": "functions",
    "codebase": "default",
    "runtime": "nodejs18",
    "timeoutSeconds": 60,
    "memory": 256
  }
}
```

## Firestore Security Rules

Update your security rules for production:

```bash
firebase deploy --only firestore:rules
```

Example production rules (`firestore.rules`):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Public playlists readable by all
    match /playlists/{playlistId} {
      allow read: if resource.data.isPublic == true;
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid != null;
    }
  }
}
```

## Alternative: Vercel Deployment

### Step 1: Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 2: Configure Environment Variables

In Vercel project settings:
- Add all `VITE_*` variables
- Set `NODE_ENV` to `production`

### Step 3: Deploy

Vercel automatically deploys on every push to main branch.

## Alternative: Netlify Deployment

### Step 1: Connect Repository

1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Select your GitHub repository

### Step 2: Build Configuration

Create `netlify.toml`:

```toml
[build]
command = "npm run build"
publish = "dist"

[build.environment]
NODE_VERSION = "18"

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### Step 3: Deploy

Netlify automatically builds and deploys on every push.

## Domain Configuration

### Firebase Hosting

```bash
firebase hosting:channel:deploy preview-channel
```

To connect a custom domain:
1. Go to Firebase Console
2. Hosting section
3. Click "Connect domain"
4. Follow DNS configuration

### Vercel & Netlify

1. Go to project settings
2. Domains section
3. Add your custom domain
4. Update DNS records

## SSL/TLS Certificates

- **Firebase**: Automatic SSL with `*.firebaseapp.com`
- **Custom domains**: Automatic with Let's Encrypt
- **All platforms**: HTTPS enforced by default

## Performance Optimization

### Build Optimization

```bash
npm run build
```

Verify bundle size:

```bash
npm run preview
```

### CDN Caching

Set cache headers in `firebase.json`:

```json
{
  "hosting": {
    "headers": [
      {
        "source": "**/*.{js,css}",
        "headers": [{"key": "Cache-Control", "value": "max-age=31536000"}]
      }
    ]
  }
}
```

## Monitoring & Logs

### View Firebase Logs

```bash
firebase functions:log
```

### Monitoring Dashboard

- Firebase Console → Performance → Monitoring
- Real-time analytics and error tracking

## Rollback

### Firebase

```bash
# List previous deployments
firebase hosting:channel:list

# Deploy a previous version
firebase deploy --only hosting
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: your-project-id
```

## Troubleshooting Deployment

### Build Fails

```bash
rm -rf node_modules dist
npm install
npm run build
```

### Functions Not Deploying

```bash
# Check Firebase login
firebase login

# Check project
firebase projects:list

# Deploy with verbose logging
firebase deploy --debug
```

### Environment Variables Not Working

- Ensure variables are prefixed with `VITE_`
- Restart development server after changes
- Verify in browser DevTools Console

## See Also

- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [Quickstart Guide](./Quickstart.md)
- [Architecture](./Architecture.md)
- [Troubleshooting](./Troubleshooting.md)
