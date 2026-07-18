'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, ArrowUp, Bot, User, Sparkles } from 'lucide-react';

export default function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      role: 'assistant',
      text: "Hi there! I'm KAI — Khristian Angelo Tiu's AI Assistant. Ask me about his experience at BPI, technical skills, or capstone projects!" 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. Capture the message from the form field
    const userMessage = { id: Date.now(), sender: 'user', role: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      // 2. Map current state array to the standard content payload for our API route
      const apiPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // 3. Post to our new internal Next.js API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
      });

      const data = await response.json();
      
      // 4. Update UI state view stream with the live generated response
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', role: 'assistant', text: data.text }]);
    } catch (error) {
      console.error("Failed to fetch response:", error);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: 'bot', role: 'assistant', text: "Sorry, I couldn't reach the server. Please try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white submit-btn-text shadow-xl shadow-blue-600/20 hover:bg-blue-500 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="Open KAI chat assistant"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
          </span>
        </button>
      )}

      {/* Main Floating Chat Interface Wrapper */}
      {isOpen && (
        <div className="flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl animate-fade-in transition-all duration-300">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between bg-zinc-950 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wide flex items-center gap-1.5">
                  KAI <Sparkles className="h-3 w-3 text-blue-400 fill-blue-400" />
                </h3>
                <p className="text-[10px] text-zinc-400 font-mono">Khristian's Artificial Intelligence</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1.5 text-zinc-400 hover:text-white transition-colors"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Feed Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/35">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs border ${
                  msg.sender === 'user' 
                    ? 'bg-zinc-800/60 border-zinc-700 text-zinc-100' 
                    : 'bg-blue-600 text-white submit-btn-text border-blue-500 shadow-md shadow-blue-500/10'
                }`}>
                  {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white submit-btn-text rounded-tr-none'
                    : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-none'
                }`}>
                  <p>
                    {msg.text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong
                            key={index}
                            className={`font-extrabold ${msg.sender === 'user' ? 'text-white submit-btn-text' : 'text-white'}`}
                          >
                            {part.slice(2, -2)}
                          </strong>
                        );
                      }
                      return part;
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Simulated Animated Thinking State */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white submit-btn-text border-blue-500 shadow-md">
                  <Bot className="h-3 w-3" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-zinc-900 border border-zinc-800 px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center h-3">
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* User Text Form Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask KAI something..."
              className="flex-1 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 text-white submit-btn-text transition-all disabled:opacity-40 disabled:hover:bg-blue-600 cursor-pointer shadow-md shadow-blue-600/10"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}