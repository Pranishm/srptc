import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, RefreshCw } from 'lucide-react';
import { queryCivxAI } from '../utils/ai';
import { getIssues } from '../utils/db';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am CivixAI, your campus assistant. Ask me anything about Civix360, report issues, check technician workloads, or request a summary of active tickets!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    // Fetch current issues context
    const activeIssues = getIssues();
    const contextSnippet = `Total issues: ${activeIssues.length}. Unassigned: ${activeIssues.filter(i => i.status === 'Unassigned').length}. Critical: ${activeIssues.filter(i => i.priority === 'Critical').length}.`;

    const replyText = await queryCivxAI(query, contextSnippet);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleQuickSummarize = () => {
    handleSend('Summarize the current campus issue status and technician workloads in brief.');
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-tr from-[#0B3C73] via-[#0A4595] to-[#00D8F6] text-white shadow-[0_12px_40px_rgba(11,60,115,0.4)] flex items-center justify-center cursor-pointer border border-white/40 backdrop-blur-lg"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-7 h-7" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="relative flex items-center justify-center">
              <Bot className="w-8 h-8" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00D8F6] rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#00D8F6] rounded-full border-2 border-[#0B3C73]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Chat Modal Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed bottom-24 right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] rounded-[40px] glass-card backdrop-blur-2xl border border-white/80 shadow-[0_20px_60px_rgba(11,60,115,0.2)] flex flex-col overflow-hidden"
          >
            {/* Organic Header */}
            <div className="bg-gradient-to-r from-[#0B3C73] via-[#0A4595] to-[#0047AB] p-6 text-white flex items-center justify-between shrink-0 rounded-t-[40px] relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2),transparent)] pointer-events-none" />
              <div className="flex items-center gap-3 z-10">
                <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                  <Sparkles className="w-6 h-6 text-[#00D8F6] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-[18px] leading-tight flex items-center gap-2">
                    CivxAI <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono font-normal">NVIDIA NIM</span>
                  </h3>
                  <p className="text-[12px] text-white/60 font-bold mt-0.5">Live Campus Assistant</p>
                </div>
              </div>
              <button
                onClick={handleQuickSummarize}
                disabled={loading}
                title="Summarize Campus Status"
                className="z-10 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white/80 transition-colors border border-white/10 cursor-pointer flex items-center gap-1.5 text-[12px] font-bold px-3"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Summary</span>
              </button>
            </div>

            {/* Quick Action Pills */}
            <div className="px-5 py-3 bg-white/40 border-b border-white/40 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
              {[
                'How to report issue?',
                'Who are the technicians?',
                'Check SLA status',
                'What is Civix360?'
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-3.5 py-1.5 rounded-full bg-white/70 hover:bg-white text-[12px] font-bold text-[#0B3C73] whitespace-nowrap shadow-sm border border-white transition-all cursor-pointer hover:scale-[1.02]"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[82%] rounded-[28px] p-4 shadow-sm text-[14px] leading-relaxed font-bold ${
                    msg.sender === 'user'
                      ? 'bg-[#0B3C73] text-white rounded-br-[8px]'
                      : 'bg-white/80 backdrop-blur-md text-[#191919] border border-white/60 rounded-bl-[8px]'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className={`text-[10px] block mt-1.5 font-sans ${msg.sender === 'user' ? 'text-white/50 text-right' : 'text-[#191919]/40'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white/80 backdrop-blur-md rounded-[28px] rounded-bl-[8px] p-4 border border-white/60 shadow-sm flex items-center gap-2 text-[13px] font-bold text-[#0B3C73]">
                    <Sparkles className="w-4 h-4 animate-spin text-[#0B3C73]" />
                    <span>CivxAI is thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 bg-white/60 border-t border-white/60 flex items-center gap-2 shrink-0 rounded-b-[40px]"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask CivxAI about campus issues..."
                className="flex-1 px-5 py-3.5 rounded-full bg-white/90 text-[14px] font-bold text-[#191919] placeholder:text-[#191919]/40 focus:outline-none focus:ring-2 focus:ring-[#0B3C73]/30 border border-white shadow-inner"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-12 h-12 rounded-full bg-[#0B3C73] hover:bg-black text-white flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer shadow-md shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
