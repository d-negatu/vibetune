// ChatInterface.jsx

/*
 * Chat Interface Component for SyncMaps Application
 * 
 * Description:
 * This component handles the chat interface aspect of the SyncMaps application.
 * It leverages ChatGPT to assist users with travel-related queries, including navigation,
 * places to visit, and directions. The chat interface is designed to provide personalized
 * assistance, making the driving experience enjoyable and stress-free.
 * 
 * Components and Libraries:
 * - React: Used for building the user interface.
 * - @chatscope/chat-ui-kit-react: Provides the components for the chat interface.
 * - sessionManagment.mjs: Utility module for managing user sessions.
 * 
 * State Management:
 * - typing: Boolean state to manage the typing indicator for the chat interface.
 * - messages: Array state to store and manage the list of messages exchanged in the chat.
 * 
 * API Integration:
 * - ChatGPT API: The application sends user messages to the ChatGPT API (model gpt-3.5-turbo)
 *   and receives responses to simulate a conversational assistant. The assistant is limited
 *   to travel-related topics.
 * 
 * Key Functions:
 * - handleSend: Handles sending user messages and updates the message list state.
 * - processMessageToChatGPT: Processes messages by sending them to the ChatGPT API and handles
 *   the responses.
 * 
 * Error Handling:
 * - Proper error handling is implemented to manage issues with API requests,
 *   ensuring robust and reliable operation.
 */


import React, { useState} from 'react';
import './chatInterface.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
//import { createSession } from './utils/sessionManagment.mjs';


// API key for accessing ChatGPT
const CHATGPT_API_KEY = "";

function syncBot(){
    // State variables for typing indicator and chat messages
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState([
      {
        message: "Welcome to SyncMaps! 🌟 I'm your personal assistant here to make your driving experience as enjoyable, educative and stress-free as possible. 🚗🎶",
        sender: "ChatGPT",
        direction: 'incoming'
      }
    ]);
  
  
   /**
   * handleSend
   * Handles sending user messages.
   * Updates the message list state and sets the typing indicator.
   * Calls processMessageToChatGPT to process and send the message to ChatGPT.
   * 
   * @param {string} message - The message sent by the user.
   */
    
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


   /**
   * processMessageToChatGPT
   * Processes chat messages and sends them to the ChatGPT API.
   * 
   * @param {Array} chatMessages - The list of chat messages to be processed.
   */
    async function processMessageToChatGPT(chatMessages) {
      // Map local chat messages to the API format
      let apiMessages = chatMessages.map((messageObject) => {
        let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
        return { role: role, content: messageObject.message };
      });
  
       // System message to guide the assistant
      const systemMessage = {
        role: "system",
        content: "You are SyncBot, a chatbot developed to help with questions on trafic, provide fun trivia questions, tell stories and crack jokes, be an educator. You cannot discuss any topic other than traveling, trivia questions, telling stories and cracking jokes here and there . If a user asks a question outside of these topics, politely remind them that you can only assist with travel-related queries."
      };
      
  
      // API request body
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
  
        // Update messages with the response from ChatGPT
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
    );
  }
  
  export default syncBot;
  