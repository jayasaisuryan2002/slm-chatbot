import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Content.css';
import usercon from '../images/Ellipse 136.png';
import loadingicon from '../images/Simple loading animation.gif';

function Content({ chatbotVisible }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Welcome! I am an AI Bot trained to address your Queries regarding PwC HC Policies. How can I assist you today?" }]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNewMessageChange = (event) => {
    const { value } = event.target;
    setNewMessage(value);
    setIsEmpty(value.trim() === '');
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      const newMessageObj = { role: "user", content: newMessage.trim() };
      setMessages((prevMessages) => [...prevMessages, newMessageObj]);
      setLoading(true);
      setSendButtonDisabled(true); 
      setNewMessage(''); 

      try {
        const response = await sendMessage(newMessage.trim());
        console.log('Response from server:', response);

        if (response.status === 200) {
          const assistantMessageObj = { role: "assistant", content: response.chain_response };
          setMessages((prevMessages) => [...prevMessages, assistantMessageObj]);
          
        } else {
          console.error("Error:", response.response);
          setSendButtonDisabled(false);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setSendButtonDisabled(false);
      } finally {
        setLoading(false);

      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  const sendMessage = async (query) => {
    try {
      const formData = new FormData();
      formData.append('query', query);
      const response = await axios.post('https://policybotbackend.azurewebsites.net/respond-la-mini', formData);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  return (
    <div className={`chat-container ${!chatbotVisible ? 'hidden' : ''}`}>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.role === "assistant" && (
              <img src={usercon} alt="Assistant" className="assistant-icon" />
            )}
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {loading && (
          <div className="loading-indicator"><img width='90px' height='85px' src={loadingicon} alt='loading gif' /></div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your Query..."
          value={newMessage}
          onChange={handleNewMessageChange}
          onKeyPress={handleKeyPress}
          disabled={loading} 
        />
        <button onClick={handleSendMessage} disabled={loading || isEmpty}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Content;