# Vibetune

---
![License](https://img.shields.io/github/license/d-negatu/vibetune) ![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)  ![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)

<div style="width: 50px; height: auto;">
  <img src="https://github.com/user-attachments/assets/710b7038-923d-4020-b2bd-bbb59e8ab650" style="width: 8%; height: auto;" alt="VibeTune Logo" />
</div>

---
Vibetune builds on third-party APIs and provides users end to end features to share their tracks and vibe with other music listeners.

---


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>




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


## 🏗️ **Architecture Overview**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │ Firebase Cloud  │    │  Spotify Web API│
│                 │◄──►│   Functions      │◄──►│                 │
│ • Social Feed   │    │ • Auth Handler  │    │ • Track Data    │
│ • Music Player  │    │ • Post Handler  │    │ • User Profile  │
│ • Real-time UI  │    │ • Feed Service  │    │ • Playlists     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  Firestore DB  │◄─────────────┘
                        │ • User Sessions│
                        │ • Music Posts  │
                        │ • Social Data  │
                        └─────────────────┘
```



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
