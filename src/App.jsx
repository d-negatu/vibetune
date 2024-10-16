// App.jsx

/*
 * Entry Point for SyncMaps Application
 * 
 * Description:
 * This component serves as the main entry point for the SyncMaps application,
 * which integrates a chat interface powered by ChatGPT and a Google Maps interface.
 * The purpose of this application is to assist users with travel-related queries,
 * including navigation, places to visit, and directions, enhancing their
 * driving experience with personalized assistance.
 * 
 * Components and Libraries:
 * - React: Used for building the user interface.
 * - @chatscope/chat-ui-kit-react: Provides the components for the chat interface.
 * - GoogleMapsComponent: A custom component that renders the Google Maps interface.
 * - sessionManagment.mjs: Utility module for managing user sessions.
 * 
 * State Management:
 * - typing: Boolean state to manage the typing indicator for the chat interface.
 * - messages: Array state to store and manage the list of messages
 *   exchanged in the chat.
 * 
 * API Integration:
 * - ChatGPT API: The application sends user messages to the ChatGPT API
 *   (model gpt-3.5-turbo) and receives responses 
 *   to simulate a conversational assistant. The assistant is limited 
 *   to travel-related topics.
 * - Google Maps API:
 *   The GoogleMapsComponent uses the Google Maps JavaScript API to render maps.
 * 
 * Key Functions:
 * - handleSend: Handles sending user messages and updates the message list state.
 * - processMessageToChatGPT:
 *   Processes messages by sending them to the ChatGPT API and handles the responses.
 * 
 * Usage:
 * - The chat interface includes message input and display components, 
 *   allowing users to interact with ChatGPT.
 * - The GoogleMapsComponent is rendered as the background,
 *   providing a seamless integration of maps and chat.
 * - The application ensures that only travel-related queries are processed
 *   by ChatGPT, maintaining focus and relevance.
 * 
 * Error Handling:
 * - Proper error handling is implemented to manage issues with API requests,
 *   ensuring robust and reliable operation.
 * 
 * This component combines the functionalities of a chat assistant 
 * and map navigation to deliver a cohesive user 
 * experience aimed at enhancing travel and navigation assistance.
 */

import React, { useState } from 'react';
import './App.css';
//import GoogleMapsComponent from './components/syncMaps/googleMaps.jsx'; 
import Dashboard from './components/syncBot/activityDashboard/dashboard.jsx';
import BarChartComponent from './components/syncBot/barChart/barChartComponent.jsx'; // Updated import

function App() {
  // Sample message data
  const [msgData, setMsgData] = useState([15, 30]); // Example values for Bots and User messages

  return (
    <div className="App">
      <BarChartComponent msgData={msgData} /> {/* Render the chart here */}
    </div>
  );
}

export default App;
