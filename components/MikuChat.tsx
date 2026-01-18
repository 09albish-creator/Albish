
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PlayerState } from '../types';
import { getMikuResponse } from '../services/geminiService';
import { Icons } from '../constants';
import { hapticFeedback } from '../utils';

interface MikuChatProps {
  playerState?: PlayerState;
  isOffline: boolean;
}

const MikuChat: React.FC<MikuChatProps> = ({ playerState, isOffline }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'miku', text: "Welcome to my digital stage! How can I help you today? ^_^", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isPlaying = playerState === PlayerState.PLAYING;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (isOffline && lastMessage?.role !== 'miku-system-offline') {
      setMessages(prev => [...prev, {
        role: 'miku-system-offline',
        text: "My connection to the data stream is down... I can't chat right now. (T_T)",
        timestamp: Date.now()
      }]);
    }
  }, [isOffline, messages]);

  const handleSend = async () => {
    if (!input.trim() || isOffline) return;
    hapticFeedback();

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const mikuReply = await getMikuResponse(input);
    const mikuMsg: ChatMessage = { role: 'miku', text: mikuReply, timestamp: Date.now() };
    
    setMessages(prev => [...prev, mikuMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-black/60 backdrop-blur-2xl relative overflow-hidden">
      {/* Decorative tech background for chat */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 border-r border-t border-miku-cyan rounded-tr-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 border-l border-b border-miku-cyan rounded-bl-3xl"></div>
      </div>

      <div className="p-6 border-b border-miku-cyan/20 flex items-center justify-between bg-miku-cyan/5 relative z-10">
        {/* Header remains the same */}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
        {messages.map((msg, i) => (
          <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`text-[10px] font-mono mb-1 uppercase tracking-widest ${msg.role === 'user' ? 'text-miku-pink/60' : 'text-miku-cyan/60'}`}>
              {msg.role === 'user' ? 'User' : 'Hatsune Miku'}
            </div>
            <div className={`max-w-[85%] relative p-4 rounded-2xl text-sm leading-relaxed tech-border ${
              msg.role === 'user' 
                ? 'bg-miku-pink/10 text-white border border-miku-pink/30 tech-border-br rounded-tr-none' 
                : 'bg-miku-cyan/10 text-miku-cyan border border-miku-cyan/30 tech-border-tl rounded-tl-none glow-border-cyan'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex flex-col items-start animate-pulse">
            <div className="text-[10px] font-mono mb-1 text-miku-cyan/40 uppercase tracking-widest italic">Miku is generating...</div>
            <div className="bg-white/5 border border-miku-cyan/20 rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
              <div className="w-1.5 h-1.5 bg-miku-cyan rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1.5 h-1.5 bg-miku-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-miku-cyan rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-miku-cyan/10 bg-black/40 relative z-10">
        <div className="flex gap-3 relative">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isOffline ? "Chat unavailable offline..." : "Send message to Diva..."}
              disabled={isOffline}
              className="w-full bg-white/5 border border-miku-cyan/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-miku-cyan/60 focus:bg-miku-cyan/5 transition-all font-mono placeholder:text-miku-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="absolute top-0 right-0 h-full flex items-center pr-3 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-opacity">
               {!isOffline && <span className="text-[10px] font-mono text-miku-cyan">[ENTER]</span>}
            </div>
          </div>
          <button 
            onClick={handleSend}
            disabled={isOffline}
            className="w-12 h-12 flex items-center justify-center bg-miku-cyan rounded-xl text-black hover:bg-white hover:scale-110 active:scale-90 transition-all shadow-[0_0_20px_rgba(57,197,187,0.3)] border-b-4 border-miku-cyan/50 disabled:bg-gray-500 disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            <Icons.Send size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MikuChat;
