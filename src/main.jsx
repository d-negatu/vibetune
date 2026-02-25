import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { FirebaseAuthProvider } from './contexts/FirebaseAuthContext'
import { SpotifyAuthProvider } from './contexts/SpotifyAuthContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <FirebaseAuthProvider>
        <SpotifyAuthProvider>
          <App />
        </SpotifyAuthProvider>
      </FirebaseAuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
