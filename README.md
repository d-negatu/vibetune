# Vibetune

---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](https://github.com/d-negatu/vibetune/blob/main/CONTRIBUTING.md)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)](https://github.com/d-negatu/vibetune/releases)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange.svg)](https://firebase.google.com/)
[![Spotify API](https://img.shields.io/badge/Spotify-API-green.svg)](https://developer.spotify.com/)

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


### **Tools, APIs and services**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     React       │    │ Firebase Cloud  │    │  Spotify Web API│
│                 │◄──►│   Functions      │◄──►│                |
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  Firestore DB  │◄─────────────|
                        └─────────────────┘
```
- ![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react) - Modern UI framework
- ![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite) - Fast build tool
- ![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?logo=css3) - Modern styling
- ![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase) - Serverless backend
- ![Firestore](https://img.shields.io/badge/Firestore-Database-FFCA28?logo=firebase) - Real-time database
- ![Cloud Functions](https://img.shields.io/badge/Cloud_Functions-Serverless-4285F4?logo=google-cloud) - Scalable APIs
- ![Spotify API](https://img.shields.io/badge/Spotify-Web_API-1DB954?logo=spotify) - Music data & playback
- ![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-000000) - Secure authentication

## 🙌 Contributions

Follow these steps to get started:

1. 🍴 **Fork** the repository  
2. 🛠️ **Create** a new branch  
3. 🧪 **Make** your changes  
4. 📦 **Commit** and push your changes  
5. 🔁 **Open** a Pull Request


## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  
  **Built with ❤️ by the Vibetune Team**
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/d-negatu)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
  [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/vibetune)
  
</div>


<div align="center">
  
  **Ready to revolutionize music discovery?** 🎵
  
  [![Get Started](https://img.shields.io/badge/Get_Started-Now-1DB954?style=for-the-badge&logo=spotify)](https://github.com/d-negatu/vibetune#quick-start)
  
  *Join the future of music sharing* ✨
  
</div>
