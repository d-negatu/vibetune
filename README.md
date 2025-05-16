# 🎧 Vibetune

![License](https://img.shields.io/github/license/d-negatu/vibetune)  
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)  
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)  
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)

<img src="https://hdcdnsun2.r.worldssl.net/sites/www.hypnosisdownloads.com/files/product-images/connected.jpg" width="250">


----
VibeTune is a locally hosted, cross-platform application that turns music sharing into a social experience. This prototype supports droping vibe posts, managing playlists and matchmaking based on shared music tastes. 




## 📜 Installation Guide

### Prerequisites

- Node.js (v16+)
- Firebase CLI
- Spotify Developer Account
- Build Environment

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/d-negatu/vibetune.git
    cd vibetune
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Configure Environment Variables**:
    Create a `.env` file in the root directory with the following details:
    ```env
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    REDIRECT_URI=http://localhost:3000/callback
    FIREBASE_PROJECT_ID=your_firebase_project_id
    ```

4. **Start the Development Server**:
    ```bash
    npm run dev
    ```
    ![Demo](./src/assets/hello.gif)

## 📂 Project Structure

```bash
├── src/
│   ├── components/
│   ├── services/
│   │   ├── spotifyService.js
│   │   ├── mapService.js
│   ├── App.js
├── functions/
├── .env
├── package.json
└── README.md
