---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](https://github.com/d-negatu/vibetune/blob/main/CONTRIBUTING.md)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)](https://github.com/d-negatu/vibetune/releases)

<div style="width: 50px; height: auto;">
  <img src="https://github.com/user-attachments/assets/710b7038-923d-4020-b2bd-bbb59e8ab650" style="width: 8%; height: auto;" alt="VibeTune Logo" />

---

Built on Spotify, Apple Music, and YouTube Music APIs, VibeTune allows users to share music posts, manage playlists, and interact with listeners across multiple streaming platforms.



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

---

## **Quick Guide**

### Prerequisites

- Node.js (v16+)
- Firebase CLI
- Spotify Developer Account
- Modern web browser

### Installation

1. **Clone & Install**
   ```bash
   git clone https://github.com/d-negatu/vibetune.git
   cd vibetune
   npm install
   ```

2. **Environment Setup**
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Add your credentials
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
   VITE_APP_SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   ```

3. **Firebase Setup**
   ```bash
   firebase login
   firebase init
   ```


### **Tools, APIs and services**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     React       │    │ Firebase Cloud  │    │External Web APIs│
│                 │◄──►│   Functions     │◄──►│                 |
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│  Firestore DB  │◄─────────────|
                        └─────────────────┘
```
- ![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react) 
- ![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite) 
- ![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?logo=css3) 
- ![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase) 
- ![Firestore](https://img.shields.io/badge/Firestore-Database-FFCA28?logo=firebase) 
- ![Cloud Functions](https://img.shields.io/badge/Cloud_Functions-Serverless-4285F4?logo=google-cloud) 
- ![Spotify API](https://img.shields.io/badge/Spotify-Web_API-1DB954?logo=spotify) 
- ![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-000000) 

## 🙌 Contributions

Follow these steps to get started:
4. **Launch**
   ```bash
   npm run dev
   ```
<div align="center">
  <img src="./src/assets/hello.gif" width="600" alt="Vibetune Demo" />
  
  *Experience the seamless social music sharing interface*
</div>

---

## 🛠️ **Tech Stack**

### **Frontend**
- ![React](https://img.shields.io/badge/React-18.0-61DAFB?logo=react) - Modern UI framework
- ![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?logo=vite) - Fast build tool
- ![CSS3](https://img.shields.io/badge/CSS3-Glassmorphism-1572B6?logo=css3) - Modern styling

### **Backend**
- ![Firebase](https://img.shields.io/badge/Firebase-Cloud-FFCA28?logo=firebase) - Serverless backend
- ![Firestore](https://img.shields.io/badge/Firestore-Database-FFCA28?logo=firebase) - Real-time database
- ![Cloud Functions](https://img.shields.io/badge/Cloud_Functions-Serverless-4285F4?logo=google-cloud) - Scalable APIs

### **APIs & Services**
- ![Spotify API](https://img.shields.io/badge/Spotify-Web_API-1DB954?logo=spotify) - Music data & playback
- ![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-000000) - Secure authentication

---

## 🤝 **Contributing**

We believe in the power of open source and community-driven development. Your contributions help make Vibetune better for everyone!

### **How to Contribute**

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💻 **Code** your changes
4. 🧪 **Test** thoroughly
5. 📝 **Commit** with clear messages (`git commit -m 'Add amazing feature'`)
6. 🚀 **Push** to your branch (`git push origin feature/AmazingFeature`)
7. 🔄 **Open** a Pull Request


<div align="center">
  
  **Built with ❤️ by the Vibetune Team**
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/d-negatu)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
  [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/vibetune)
  
</div>


---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---






