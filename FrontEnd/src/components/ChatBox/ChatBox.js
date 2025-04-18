import React, { useState } from 'react';
import './styles/main.scss';
import axios from 'axios'; 
import ReactMarkdown from 'react-markdown';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
  
    // Add user's message
    setMessages(prev => [...prev, { sender: 'You', text: input }]);
    const userInput = input;
    setInput('');
  
      // Send POST request to REST API
    axios.post('http://127.0.0.1:8000/', {
    model: 'gemma-3-4b-it',
    messages: [
        { role: 'user', content: userInput }
    ],
    temperature: 0.7
    })
    .then(response => {
        console.log('Response:');
        console.log('Chat Response:', response);
        setMessages(prev => [
            ...prev,
            { sender: 'Bot', text: response.data.message}
            ]);
    })
    .catch(error => {
        console.log('Error:');  
        console.error('Error:', error.response?.data || error.message);
        setMessages(prev => [
            ...prev,
            { sender: 'Bot', text: 'Error: Unable to fetch response.' },
            ]);
    });


  // axios.get('http://127.0.0.1:8000/start')
  // .then(response => {
  //   console.log('Chat Response:', response);
  //   setMessages(prev => [
  //     ...prev,
  //     { sender: 'Bot', text: response.data.message } // <- access the message field
  //   ]);
  // })
  // .catch(error => {
  //   console.error('Error:', error.response?.data || error.message);
  //   setMessages(prev => [
  //     ...prev,
  //     { sender: 'Bot', text: 'Error: Unable to fetch response.' },
  //   ]);
  // });


  };

  const handleKeyDown = (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chat-container">
      <div className="chat-output">
        {messages.map((msg, i) => (
        <div key={i} className={`message ${msg.sender === 'You' ? 'user' : 'bot'}`}>
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
