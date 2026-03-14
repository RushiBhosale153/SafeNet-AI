import React, { useState, useRef, useEffect } from 'react';
import { aiAPI } from '../services/api';
import { FaRobot, FaUser, FaPaperPlane, FaTrash } from 'react-icons/fa';

const AIAssistant = () => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('cyber-assistant-chats');
    return saved ? JSON.parse(saved) : [
      {
        role: 'assistant',
        content: '🔒 ACCESS_GRANTED. I am the CyberNet Intelligence Unit. How can I assist with your security protocols today?'
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('cyber-assistant-chats', JSON.stringify(messages));
  }, [messages]);

  const clearChat = () => {
    const initialMessage = [
      {
        role: 'assistant',
        content: '🔒 ACCESS_GRANTED. I am the CyberNet Intelligence Unit. How can I assist with your security protocols today?'
      }
    ];
    setMessages(initialMessage);
    localStorage.removeItem('cyber-assistant-chats');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim().length === 0) return;

    const userMessage = input;
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const conversationHistory = newMessages
        .filter(msg => msg.role !== 'assistant' || messages.indexOf(msg) !== 0)
        .map(msg => ({ role: msg.role, content: msg.content }));

      const response = await aiAPI.chat(userMessage, conversationHistory.slice(0, -1));
      setMessages([...newMessages, { role: 'assistant', content: response.data.message }]);
    } catch (err) {
      const errorMessage = err.response?.data?.details || 'LINK_FAILURE: Connection to AI core lost.';
      setMessages([...newMessages, { role: 'assistant', content: `❌ ERROR: ${errorMessage}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black" data-testid="ai-assistant-page">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              <FaRobot className="text-7xl text-cyber-green animate-pulse-slow relative z-10" />
              <div className="absolute inset-0 bg-cyber-green/20 blur-2xl rounded-full"></div>
            </div>
            <h1 className="text-5xl font-bold text-white tracking-widest uppercase mb-4">
              AI <span className="text-cyber-green">Assistant</span>
            </h1>
            <div className="flex flex-col items-center">
              <p className="text-gray-500 font-mono text-sm uppercase tracking-[0.3em]">
                Neural_Processing_Active
              </p>
              <button 
                onClick={clearChat}
                className="mt-4 text-[10px] text-gray-500 hover:text-cyber-red transition-all flex items-center gap-2 uppercase font-bold tracking-widest"
              >
                <FaTrash className="text-xs" />
                Purge History
              </button>
            </div>
          </div>

          {/* Chat Container */}
          <div className="glass border border-cyber-blue/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col" style={{ height: '650px' }}>
            {/* Terminal Top Bar */}
            <div className="bg-cyber-blue/10 px-6 py-2 border-b border-cyber-blue/20 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-cyber-red"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-cyber-green"></div>
              </div>
              <div className="text-[10px] font-mono text-cyber-blue/60 uppercase font-bold">Secure_Channel_v4</div>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto p-8 space-y-6 custom-scrollbar bg-black/40" data-testid="chat-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-500`}
                  data-testid={`message-${index}`}
                >
                  <div className={`flex items-start gap-4 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse text-right' : ''}`}>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                      message.role === 'user' ? 'border-cyber-blue bg-cyber-blue/10' : 'border-cyber-green bg-cyber-green/10'
                    }`}>
                      {message.role === 'user' ? <FaUser className="text-cyber-blue" /> : <FaRobot className="text-cyber-green" />}
                    </div>

                    <div className={`p-5 rounded-2xl text-sm leading-relaxed ${
                      message.role === 'user' 
                        ? 'bg-cyber-blue/20 border border-cyber-blue/30 text-white rounded-tr-none' 
                        : 'bg-black/60 border border-cyber-green/30 text-gray-300 rounded-tl-none font-mono'
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-pulse">
                  <div className="flex items-start gap-4 max-w-[80%]">
                    <div className="w-10 h-10 rounded-lg border-2 border-cyber-green/50 bg-cyber-green/10 flex items-center justify-center">
                       <FaRobot className="text-cyber-green" />
                    </div>
                    <div className="p-5 bg-black/40 border border-cyber-green/20 rounded-2xl rounded-tl-none flex space-x-2 h-14 items-center">
                      <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-black/60 border-t border-cyber-blue/20">
              <div className="relative group">
                <input
                  type="text"
                  data-testid="chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Intercepting input..."
                  className="w-full bg-black/40 border-2 border-cyber-blue/20 rounded-xl px-6 py-4 text-white font-mono text-sm focus:outline-none focus:border-cyber-blue transition-all pr-32"
                  disabled={loading}
                />
                <button
                  type="submit"
                  data-testid="send-button"
                  disabled={loading || input.trim().length === 0}
                  className="absolute right-2 top-2 bottom-2 bg-cyber-blue text-cyber-black font-bold px-6 rounded-lg hover:bg-white transition-all disabled:opacity-30 flex items-center gap-2 uppercase text-xs tracking-widest"
                >
                  <FaPaperPlane />
                  Transmit
                </button>
              </div>
            </form>
          </div>

          {/* Encryption Notice */}
          <div className="mt-8 flex items-center justify-center space-x-4 opacity-50">
             <div className="h-[1px] bg-cyber-blue/30 flex-grow"></div>
             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] whitespace-nowrap">
                AES-256 Link Active
             </p>
             <div className="h-[1px] bg-cyber-blue/30 flex-grow"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;