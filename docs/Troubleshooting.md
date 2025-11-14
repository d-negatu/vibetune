# VibeTune Troubleshooting Guide

## Common Issues and Solutions

### Installation & Setup

#### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

#### Issue: Node version incompatibility

**Solution:**
Ensure you're using Node.js 16 or higher:
```bash
node --version  # Should be v16.0.0 or higher

# Use nvm to switch versions
nvm use 18
```

#### Issue: Port 5173 already in use

**Solution:**
```bash
# Run on different port
npm run dev -- --port 5174

# Or kill the process using port 5173
# On macOS/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Firebase Configuration

#### Issue: Firebase credentials not found

**Solution:**
1. Create `.env` file in project root
2. Add all required Firebase credentials:
```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
3. Restart dev server: `npm run dev`

#### Issue: Authentication fails

**Solution:**
1. Check Firebase Console:
   - Go to Authentication > Sign-in method
   - Ensure Email/Password is enabled
   - Check authorized domains
2. Verify authentication settings in `src/services/firebase.js`
3. Clear browser cache and cookies
4. Try incognito/private window

#### Issue: Firestore rules rejecting requests

**Solution:**
Check `firestore.rules`. Make sure your rules allow the current user:
```
match /playlists/{playlistId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

Deploy updated rules:
```bash
firebase deploy --only firestore:rules
```

### Development Issues

#### Issue: Hot Module Replacement (HMR) not working

**Solution:**
```bash
# Restart dev server
npm run dev

# If still broken, clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### Issue: Components not updating after changes

**Solution:**
1. Verify you're editing the correct file
2. Check for syntax errors in browser console
3. Clear browser cache: Ctrl+Shift+R (or Cmd+Shift+R)
4. Restart dev server

#### Issue: Import errors "Cannot find module"

**Solution:**
1. Check file path is correct
2. Verify file exists
3. Use relative paths: `./components/Button.vue`
4. Check `vite.config.js` aliases:
```javascript
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Build Issues

#### Issue: Build fails or times out

**Solution:**
```bash
# Clean build
rm -rf dist
npm run build

# If still fails, check for large files
ls -lh src/  # Check file sizes
```

#### Issue: Built file too large

**Solution:**
1. Analyze bundle:
```bash
npm run build  # Will show bundle size
```

2. Use code splitting:
```javascript
// Lazy load components
const Recommendations = () => import('./views/Recommendations.vue')
```

3. Remove unused dependencies:
```bash
npm audit
npm prune
```

### Authentication Issues

#### Issue: "User not authenticated"

**Solution:**
1. Check if user is logged in:
```javascript
import { auth } from '@/services/firebase'
auth.currentUser // Should not be null
```

2. Verify token:
```javascript
const token = await auth.currentUser.getIdToken()
console.log(token)
```

#### Issue: Session expires unexpectedly

**Solution:**
Add session persistence in `src/services/firebase.js`:
```javascript
import { setPersistence, browserSessionPersistence } from 'firebase/auth'

setPersistence(auth, browserSessionPersistence)
```

### API Issues

#### Issue: 401 Unauthorized errors

**Solution:**
1. Verify user is authenticated
2. Check Firebase ID token is included in request headers
3. Verify token hasn't expired:
```bash
# In browser console
firebase.auth().currentUser.getIdToken(true)
```

#### Issue: 429 Too Many Requests

**Solution:**
You're hitting rate limits. Implement exponential backoff:
```javascript
async function retry(fn, maxAttempts = 3) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.code !== 429) throw error
      const delay = Math.pow(2, i) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}
```

#### Issue: CORS errors

**Solution:**
Ensure your Firebase domain is whitelisted:
1. Firebase Console > Authentication > Authorized domains
2. Add your domain: `localhost:5173`, `your-domain.com`

### Performance Issues

#### Issue: App is slow

**Solution:**
1. Check Network tab (DevTools)
2. Look for large assets
3. Enable lazy loading for routes
4. Use Vue DevTools to identify expensive components
5. Check Firestore indexes in Firebase Console

#### Issue: Firestore queries are slow

**Solution:**
1. Create composite indexes:
   - Firebase Console > Firestore > Indexes
   - Click "Create Index" for your query
2. Optimize query:
```javascript
// Bad: No index
db.collection('playlists')
  .where('userId', '==', uid)
  .where('isPublic', '==', true)
  .orderBy('createdAt', 'desc')
  .get()
```

### Deployment Issues

#### Issue: "Cannot find command: firebase"

**Solution:**
```bash
npm install -g firebase-tools
firebase --version
```

#### Issue: Deployment fails

**Solution:**
```bash
# Login again
firebase logout
firebase login

# Check project
firebase projects:list

# Deploy with verbose logging
firebase deploy --debug
```

#### Issue: Environment variables not in production

**Solution:**
1. Variables must be prefixed with `VITE_`
2. Add to both `.env.local` and Firebase Console (if using Hosting variables)
3. Rebuild: `npm run build`

### Browser Issues

#### Issue: App won't load in certain browser

**Solution:**
1. Check browser compatibility
2. Clear cache and cookies
3. Try incognito/private window
4. Check browser console for errors
5. Update browser to latest version

#### Issue: localStorage not persisting

**Solution:**
Check if cookies are enabled:
1. Browser Settings > Privacy
2. Ensure cookies are not blocked
3. Add site to exceptions

### Debug Mode

#### Enable verbose logging

```javascript
// In main.js
import.meta.env.DEV && console.log('Development mode')

// Firebase debugging
import { enableLogging } from 'firebase/database'
if (import.meta.env.DEV) {
  enableLogging(true)
}
```

#### Use Vue DevTools

1. Install [Vue DevTools](https://devtools.vuejs.org/)
2. Inspect components in "Components" tab
3. Check state in "Pinia" tab

### Getting Help

If you can't find a solution:

1. **Check existing issues:** [GitHub Issues](../../issues)
2. **Create a new issue:** Include:
   - Steps to reproduce
   - Error message
   - Browser/OS info
   - VibeTune version
3. **Join discussions:** [GitHub Discussions](../../discussions)
4. **Read documentation:**
   - [Quickstart Guide](./Quickstart.md)
   - [API Reference](./API.md)
   - [Architecture](./Architecture.md)
   - [Deployment Guide](./Deployment.md)

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run linter

# Firebase
firebase emulate:start   # Start Firebase emulator
firebase deploy          # Deploy to Firebase
firebase functions:log   # View function logs

# Debugging
node --inspect server.js # Debug with Chrome DevTools
```
