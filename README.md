# Vibetune

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](https://github.com/d-negatu/vibetune/blob/main/CONTRIBUTING.md)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev/)

<img src="https://github.com/user-attachments/assets/710b7038-923d-4020-b2bd-bbb59e8ab650" alt="VibeTune Logo" style="width: 150px; height: auto;" />

**A unified music discovery platform that integrates Spotify, Apple Music, and YouTube Music APIs** — enabling users to share music posts, discover new artists, manage playlists, and interact with a global music community across multiple streaming platforms.

## 📋 Quick Overview

**VibeTune** is a full-stack web application that bridges the gap between different music streaming platforms. Instead of being locked into one ecosystem, users can seamlessly interact with music across their preferred services.

### 🎯 Core Features

- **🔄 Cross-Platform Integration**: Connect and sync with Spotify, Apple Music, and YouTube Music
- **🎤 Music Discovery**: AI-powered recommendations based on listening habits
- **📱 Social Sharing**: Post music, create playlists, and share with friends
- **💬 Community Interaction**: Comment, like, and engage with other music enthusiasts
- **🎛️ Unified Playlist Management**: Create and manage playlists across multiple platforms
- **📊 Music Analytics**: Visualize your listening patterns and statistics
- **🔐 Secure Authentication**: OAuth2 integration with all major music services
- **📲 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Query** - Server state management
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js + Express** - RESTful API server
- **MongoDB** - NoSQL database for user data
- **Firebase** - Authentication and real-time features
- **Redis** - Caching and session management
- **Docker** - Containerization for deployment

### External APIs
- **Spotify Web API** - Music catalog and user data
- **Apple Music API** - Apple's music service integration
- **YouTube Music API** - Video and music streaming
- **Last.fm API** - Music statistics and recommendations

### DevOps & Deployment
- **Docker & Docker Compose** - Container orchestration
- **GitHub Actions** - CI/CD pipeline
- **AWS** - Cloud infrastructure
- **Nginx** - Reverse proxy and load balancing

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Docker** (optional, for containerized setup)
- API credentials from:
  - [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
  - [Apple Music Token](https://developer.apple.com/documentation/applemusicapi)
  - [YouTube Music API](https://www.youtube.com/watch?v=v7ecJF8zgP4)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/d-negatu/vibetune.git
cd vibetune
```

#### 2. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd ../backend
npm install
```

#### 3. Setup Environment Variables

Create a `.env` file in both frontend and backend directories:

**Frontend (.env)**
```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FIREBASE_CONFIG={"apiKey":"...","projectId":"..."}
```

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/vibetune
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
JWT_SECRET=your_jwt_secret_key
FIREBASE_KEY=your_firebase_key
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=5000
```

#### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

#### 5. Or Use Docker

```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`

## 📖 Usage

### For End Users

1. **Sign Up** - Create an account or use OAuth login
2. **Connect Services** - Link your Spotify, Apple Music, or YouTube Music accounts
3. **Discover Music** - Browse recommendations and discover new artists
4. **Create Playlists** - Build curated playlists across platforms
5. **Share & Interact** - Post music, comment, and engage with the community

### For Developers

#### API Endpoints

```bash
# Authentication
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/callback/spotify
GET    /api/auth/callback/apple

# User Profile
GET    /api/users/:id
PUT    /api/users/:id
GET    /api/users/:id/playlists

# Music Discovery
GET    /api/discover/recommendations
GET    /api/artists/:id
GET    /api/albums/:id
GET    /api/tracks/:id

# Playlists
GET    /api/playlists
POST   /api/playlists
PUT    /api/playlists/:id
DELETE /api/playlists/:id
POST   /api/playlists/:id/tracks

# Social Features
GET    /api/posts
POST   /api/posts
POST   /api/posts/:id/like
POST   /api/posts/:id/comment
```

#### Running Tests

```bash
# Frontend tests
npm run test
npm run test:coverage

# Backend tests
npm run test
npm run test:integration
```

#### Building for Production

```bash
# Frontend build
npm run build

# Backend production
npm start
```

## 📁 Project Structure

```
vibetune/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API integration
│   │   ├── store/           # Redux state management
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript types
│   │   └── App.tsx
│   ├── public/              # Static assets
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── src/
│   │   ├── routes/          # Express route handlers
│   │   ├── controllers/     # Business logic
│   │   ├── models/          # Database schemas
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # External API integration
│   │   ├── utils/           # Utility functions
│   │   └── app.ts
│   ├── package.json
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## 📊 Architecture

```
┌─────────────────────────────────────────────────────┐
│                   User Browser                      │
│              (React + Vite Frontend)                │
└──────────────────┬──────────────────────────────────┘
                   │ HTTPS/REST API
┌──────────────────▼──────────────────────────────────┐
│              Express.js Backend                     │
│         (Node.js RESTful API Server)               │
├──────────────────────────────────────────────────────┤
│  - Authentication (Firebase/JWT)                    │
│  - Music Service Integration                        │
│  - Database (MongoDB)                               │
│  - Caching Layer (Redis)                            │
└──────────┬────────────┬───────────────┬─────────────┘
           │            │               │
    ┌──────▼───┐  ┌─────▼──┐  ┌────────▼──────┐
    │ Spotify  │  │ Apple  │  │  YouTube      │
    │   API    │  │ Music  │  │  Music API    │
    └──────────┘  └────────┘  └───────────────┘
```

## 🎯 Key Features in Development

### Current (v1.0)
- ✅ Cross-platform music integration
- ✅ User authentication
- ✅ Playlist management
- ✅ Basic social features
- ✅ Music discovery

### Upcoming (v2.0)
- 🔄 AI-powered recommendations
- 🔄 Advanced analytics dashboard
- 🔄 Mobile app (React Native)
- 🔄 Real-time collaboration
- 🔄 Offline playlist sync

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Backend Testing

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Using Docker

```bash
# Build and start
docker-compose up --build

# Stop services
docker-compose down
```

### AWS Deployment

```bash
# Setup with AWS CLI
aws s3 mb s3://vibetune-bucket

# Deploy frontend to S3
npm run build
aws s3 sync dist/ s3://vibetune-bucket

# Deploy backend to EC2 or ECS
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy
on: [push]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: npm test
      - name: Deploy
        run: npm run deploy
```

## 📈 Performance Metrics

- **Page Load Time**: < 2s (First Contentful Paint)
- **API Response Time**: < 200ms average
- **Database Query Time**: < 100ms
- **Lighthouse Score**: 90+
- **Uptime**: 99.9%

## 🐛 Troubleshooting

### Issue: API Key Not Working
```bash
# Solution: Check .env file and restart server
cat .env
npm run dev
```

### Issue: CORS Errors
```bash
# Solution: Update CORS middleware in backend
# backend/src/middleware/cors.ts
```

### Issue: Database Connection Failed
```bash
# Solution: Ensure MongoDB is running
mongod
```

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

- **Developer**: Dagmawi Negatu
- **Email**: dagmawi.negatu@gmail.com
- **LinkedIn**: [danegatu](https://www.linkedin.com/in/danegatu)
- **GitHub**: [@d-negatu](https://github.com/d-negatu)
- **Issues**: [GitHub Issues](https://github.com/d-negatu/vibetune/issues)

## 🙏 Acknowledgments

- Spotify Web API documentation and community
- Apple Music API resources
- YouTube Music API integration guides
- Open-source community and contributors
- Firebase for authentication infrastructure

---

**⭐ If you find VibeTune helpful, please consider giving it a star!** It helps us reach more developers and music enthusiasts.

**Built with ❤️ by Dagmawi Negatu | Last Updated: October 2025**
