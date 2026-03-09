import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🔒 Hello! I\'m your cybersecurity assistant. Ask me anything about online security, privacy, or scan results!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    
    if (input.trim().length === 0) return;

    const userMessage = input;
    setInput('');
    
    // Add user message
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = newMessages
        .filter(msg => msg.role !== 'assistant' || messages.indexOf(msg) !== 0) // Exclude welcome message
        .map(msg => ({ role: msg.role, content: msg.content }));

      const response = await aiAPI.chat(userMessage, conversationHistory.slice(0, -1));
      
      // Add AI response
      setMessages([...newMessages, { role: 'assistant', content: response.data.message }]);
    } catch (err) {
      const errorMessage = err.response?.data?.details || 'Failed to get response. Please try again.';
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `❌ Error: ${errorMessage}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="ai-assistant-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <FaRobot className="text-6xl text-cyber-green mx-auto mb-4 animate-pulse-slow" />
            <h1 className="text-4xl font-bold text-cyber-blue font-mono" data-testid="page-title">
              AI Cybersecurity Assistant
            </h1>
            <p className="text-gray-400 mt-2">
              Get expert advice on cybersecurity topics
            </p>
          </div>

          {/* Chat Container */}
          <div className="bg-cyber-darker border-2 border-cyber-blue rounded-lg overflow-hidden" style={{ height: '600px' }}>
            {/* Messages */}
            <div className="h-[calc(100%-80px)] overflow-y-auto p-4 space-y-4" data-testid="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${index}`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-cyber-blue'
                          : 'bg-cyber-green'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <FaUser className="text-cyber-black" />
                      ) : (
                        <FaRobot className="text-cyber-black" />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-cyber-blue text-cyber-black'
                          : 'bg-cyber-black border-2 border-cyber-green text-gray-300'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-cyber-green">
                      <FaRobot className="text-cyber-black" />
                    </div>
                    <div className="rounded-lg p-4 bg-cyber-black border-2 border-cyber-green text-gray-300">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="border-t-2 border-cyber-blue p-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  data-testid="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cybersecurity..."
                  className="flex-1 bg-cyber-black border-2 border-cyber-blue rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyber-green transition-colors"
                  disabled={loading}
                />
                <button
                  type="submit"
                  data-testid="send-button"
                  disabled={loading || input.trim().length === 0}
                  className="bg-cyber-green text-cyber-black font-bold px-6 py-3 rounded-lg hover:bg-cyber-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <FaPaperPlane />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>

          {/* Info */}
          <div className="mt-4 bg-cyber-darker border border-cyber-blue rounded-lg p-4">
            <p className="text-gray-400 text-sm">
              🔒 <strong className="text-cyber-blue">Privacy:</strong> This AI only answers cybersecurity questions. 
              It cannot access API keys, backend architecture, or system configurations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;