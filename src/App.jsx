import React, { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const CHATGPT_API_KEY = "sk-proj-xjq5peFYMc7OAGTqNgP0T3BlbkFJGeViiyOW6W2pn64vAyvd";
const GOOGLE_MAPS_API_KEY = "AIzaSyCiCpGFCrISLgE6sft9HwA7CFmlcBqPZAs"; // Replace with your Google Maps API Key

const containerStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function App() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello Explorer, I am MapBot!",
      sender: "ChatGPT",
      direction: 'incoming'
    }
  ]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "You are Sync Maps, a chatbot developed to help with travel, maps and music. You cannot discuss any topic other than traveling, navigation, places to visit, directions, recommending . If a user asks a question outside of these topics, politely remind them that you can only assist with travel-related queries."
    };
    

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [systemMessage, ...apiMessages]
    };

    try {
      console.log("API Request Body:", JSON.stringify(apiRequestBody));

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + CHATGPT_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiRequestBody)
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Full response data:", data);
      console.log("Message content:", data.choices[0].message.content);

      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming"
      }]);
    } catch (error) {
      console.error("Error during fetch:", error);
    } finally {
      setTyping(false);
    }
  }

  return (
    <div className="App">
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        />
      )}
      <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing" /> : null}>
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default App;
