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
      text: "Hi there! I'm KAI — Khristian Angelo Tiu's AI Assistant. Ask me about his experience, technical skills, or capstone projects!" 
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
      // 2. Map current state array to the standard content payload for API route
      const apiPayload = updatedMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      // 3. Post to internal Next.js API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
      });

      const data = await response.json();
      
      // 4. Update UI state view stream with live response
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
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 hover:bg-cyan-400 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="Open KAI chat assistant"
        >
          <MessageSquare className="h-6 w-6 transition-transform group-hover:rotate-6 text-slate-950" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-300"></span>
          </span>
        </button>
      )}

      {/* Main Floating Chat Interface Wrapper */}
      {isOpen && (
        <div className="flex h-[500px] w-[360px] flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-slate-950/20 animate-fade-in transition-all duration-300">
          
          {/* Header Banner */}
          <div className="flex items-center justify-between bg-slate-100/90 dark:bg-slate-900/90 px-5 py-4 text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-wide flex items-center gap-1.5 text-slate-950 dark:text-white">
                  KAI <Sparkles className="h-3.5 w-3.5 text-cyan-500 fill-cyan-500" />
                </h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">Khristian's AI Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-1.5 text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Feed Viewport */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 dark:bg-[#030712]/40">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2.5 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs border ${
                  msg.sender === 'user' 
                    ? 'bg-slate-200/80 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200' 
                    : 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm shadow-cyan-500/20'
                }`}>
                  {msg.sender === 'user' ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 font-bold" />}
                </div>
                <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-cyan-500 dark:bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800/80 rounded-tl-none'
                }`}>
                  <p>
                    {msg.text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong
                            key={index}
                            className={`font-black ${msg.sender === 'user' ? 'text-slate-950' : 'text-slate-950 dark:text-white'}`}
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

            {/* Animated Thinking State */}
            {isTyping && (
              <div className="flex gap-2.5 max-w-[85%]">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3.5 shadow-sm">
                  <div className="flex gap-1.5 items-center h-3">
                    <div className="h-2 w-2 rounded-full bg-cyan-500/80 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="h-2 w-2 rounded-full bg-cyan-500/80 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="h-2 w-2 rounded-full bg-cyan-500/80 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask KAI something..."
              className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl px-4 py-2 text-sm outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-colors shadow-inner font-normal"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4 stroke-[2.5]" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}