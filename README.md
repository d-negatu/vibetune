---
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen)](https://github.com/d-negatu/vibetune/blob/main/CONTRIBUTING.md)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/d-negatu/vibetune)](https://github.com/d-negatu/vibetune/releases)
[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Cloud-orange.svg)](https://firebase.google.com/)
[![Spotify API](https://img.shields.io/badge/Spotify-API-green.svg)](https://developer.spotify.com/)

<div style="width: 50px; height: auto;">
  <img src="https://github.com/user-attachments/assets/710b7038-923d-4020-b2bd-bbb59e8ab650" style="width: 8%; height: auto;" alt="VibeTune Logo" />


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



## 🌟 **The Problem We're Solving**

**Music is meant to be shared, but current platforms make it solitary.**

- 🎧 **Playlists are private** - No way to discover what friends are listening to
- 🤖 **Discovery is algorithmic** - Not human, not social, not personal
- 🔒 **Sharing is complicated** - Multiple steps, different platforms, fragmented experience
- 📱 **No real-time connection** - Can't see what's playing right now

## ✨ **The Vibetune Solution**

**A social music platform that transforms how you discover and share music.**

### 🎯 **Core Features**

- **🎵 Real-time Music Sharing** - Share what you're listening to instantly
- **👥 Social Feed** - See what your friends are vibing to right now
- **🔗 Seamless Spotify Integration** - Works directly with your Spotify account
- **💬 Social Interactions** - Like, comment, and share music moments
- **🎨 Beautiful UI/UX** - Instagram/Twitter-style interface for music
- **⚡ Real-time Updates** - Live feed updates and notifications

### 🏗️ **Technical Architecture**

Built with modern, scalable technologies:

- **Frontend**: React 18, Vite, Modern CSS with Glassmorphism
- **Backend**: Firebase Cloud Functions, Firestore Database
- **Authentication**: Spotify OAuth 2.0, Firebase Auth
- **Real-time**: Firestore Live Updates, Pub/Sub Systems
- **Deployment**: Firebase Hosting, Google Cloud Platform

---

## 🚀 **Quick Start**

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
4. **Launch**
   ```bash
   npm run dev
   ```
   
   🎉 **Visit `http://localhost:5173` to start vibing!**

---

## 🎨 **User Experience**

### **Social Music Feed**
- Instagram/Twitter-style interface
- Real-time music posts from friends
- Interactive like, comment, and share features
- Beautiful glassmorphism design

### **Seamless Integration**
- One-click Spotify authentication
- Automatic token management
- Real-time playback integration
- Cross-platform compatibility

### **Discovery Features**
- Vibe-based music matching
- Social recommendations
- Trending tracks from your network
- Personalized music feed

---

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

---

## 📱 **Screenshots**

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

## 🎯 **Roadmap**

### **Phase 1: Core Platform** ✅
- [x] Spotify OAuth integration
- [x] Social music feed
- [x] Real-time post sharing
- [x] Basic user interactions

### **Phase 2: Enhanced Social Features** 🚧
- [ ] Friend system & following
- [ ] Music rooms & group listening
- [ ] Advanced music recommendations
- [ ] Push notifications

### **Phase 3: Advanced Features** 📋
- [ ] AI-powered music matching
- [ ] Collaborative playlists
- [ ] Music events & concerts
- [ ] Mobile app development

### **Phase 4: Scale & Monetization** 🔮
- [ ] Premium subscription features
- [ ] Artist partnerships
- [ ] Music industry integrations
- [ ] Global expansion

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
### **Contribution Areas**

- 🎨 **UI/UX Design** - Improve the visual experience
- 🔧 **Backend Development** - Enhance server-side functionality
- 📱 **Mobile Development** - Build native mobile apps
- 🧪 **Testing** - Improve code quality and reliability
- 📚 **Documentation** - Help others understand the project
- 🌐 **Internationalization** - Make Vibetune global

---

## 📊 **Project Stats**

![GitHub stars](https://img.shields.io/github/stars/d-negatu/vibetune?style=social)
![GitHub forks](https://img.shields.io/github/forks/d-negatu/vibetune?style=social)
![GitHub issues](https://img.shields.io/github/issues/d-negatu/vibetune)
![GitHub pull requests](https://img.shields.io/github/issues-pr/d-negatu/vibetune)

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

<div align="center">
  
  **Built with ❤️ by the Vibetune Team**
  
  [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/d-negatu)
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/your-profile)
  [![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/vibetune)
  
</div>

---

## 🙏 **Acknowledgments**

- **Spotify** for the amazing Web API
- **Firebase** for the robust backend infrastructure
- **React Community** for the incredible ecosystem
- **Open Source Contributors** who make this project possible

---

<div align="center">
  
  **Ready to revolutionize music discovery?** 🎵
  
  [![Get Started](https://img.shields.io/badge/Get_Started-Now-1DB954?style=for-the-badge&logo=spotify)](https://github.com/d-negatu/vibetune#quick-start)
  
  *Join the future of social music sharing* ✨
  
</div>



