# <div style="width: 50px; height: auto;">
  <img src="https://github.com/user-attachments/assets/710b7038-923d-4020-b2bd-bbb59e8ab650" style="width: 8%; height: auto;" alt="VibeTune Logo" />
</div>
ibetune

---
![License](https://img.shields.io/github/license/d-negatu/vibetune) ![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)  ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)


---

# 🧩 Problem

Music streaming is solitary. Playlists are private. Discovery is algorithmic, not social. We aim to make music sharing as effortless as listening.

----
VibeTune is an end to end application that provices users tools to share their listening activity and discover what other listeners are vibing to. 

This MVP is built on the Spotify Web API and prototypes various features like Google Maps heatmaps, vibe-based matchmaking, real-time chat, playlist management, OAuth authentication, and vibe drops with reactions.

Vibetune is a locally hosted open-source project to explore how music can be a social experience. If you're interested in shaping the future of social music tech, we welcome open contributions. 

---



## 📜 Installation Guide

### Prerequisites

- Node.js (v16+)
- Firebase CLI
- Spotify Developer Account
- Working Build Environment

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
    Create a `.env` file in the root directory with the following:
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



## 🙌 Contributions

Follow these steps to get started:

1. 🍴 **Fork** the repository  
2. 🛠️ **Create** a new branch  
3. 🧪 **Make** your changes  
4. 📦 **Commit** and push your changes  
5. 🔁 **Open** a Pull Request


## 📂 Project Structure

```bash
├── src/
│   ├── components/
│   ├── services/
│   ├── App.js
├── functions/
├── .env
├── package.json
└── README.md



