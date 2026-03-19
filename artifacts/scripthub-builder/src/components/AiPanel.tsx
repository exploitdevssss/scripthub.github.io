import { useState, useRef, useEffect } from 'react';
import { HubConfig } from '../lib/types';
import { Sparkles, Send, X, ChevronDown, Bot, User, Loader2, RefreshCw, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
  isConfig?: boolean;
}

const SUGGESTIONS = [
  "Hello! What can you do?",
  "Add a Tracer script to Visuals tab",
  "Add Player ESP toggle to Visuals tab",
  "Change the theme to blood red",
  "Add a Speed slider with max 500",
  "Add a God Mode toggle to Player tab",
  "Fully redesign the UI with a Matrix green theme",
  "Add an Auto Farm tab with a farm loop button",
  "Add a Spin toggle to Player tab",
  "Make the hub window bigger and cyber cyan theme",
  "Add anti-afk toggle to Misc tab",
  "Add a fling nearby players button",
];

export function AiPanel({
  config,
  onApply,
}: {
  config: HubConfig;
  onApply: (newConfig: HubConfig) => void;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hey! I'm your AI hub builder. I can redesign your UI, write complex Lua scripts (tracers, ESP, fly, etc.), add features, change themes, and more. Just tell me what you want!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [configUpdates, setConfigUpdates] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const send = async (msg?: string) => {
    const text = (msg ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, config }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages(prev => [...prev, { role: 'error', content: data.error || 'Request failed' }]);
        return;
      }

      // Handle dual response types
      if (data.type === 'chat') {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message || "I'm not sure what to say!" }]);
      } else if (data.type === 'config' && data.newConfig) {
        onApply(data.newConfig);
        setConfigUpdates(prev => prev + 1);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.explanation || 'Hub updated!',
          isConfig: true
        }]);
      } else if (data.newConfig) {
        // Fallback for old format
        onApply(data.newConfig);
        setConfigUpdates(prev => prev + 1);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.explanation || 'Hub updated!',
          isConfig: true
        }]);
      } else if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [...prev, { role: 'error', content: 'Unexpected response from AI' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'error', content: 'Network error — is the server running?' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! What would you like to build?"
    }]);
    setConfigUpdates(0);
  };

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm text-primary-foreground shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)] transition-shadow"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        <Sparkles size={16} />
        AI Assistant
        {configUpdates > 0 && (
          <span className="bg-white/20 text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center">
            {configUpdates}
          </span>
        )}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="fixed bottom-20 right-6 z-50 w-[440px] rounded-2xl border border-primary/30 bg-card shadow-[0_0_60px_rgba(0,0,0,0.7),_0_0_0_1px_rgba(168,85,247,0.15)] flex flex-col overflow-hidden"
            style={{ maxHeight: '560px' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur-sm flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Sparkles size={14} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">AI Hub Builder</p>
                <p className="text-[10px] text-muted-foreground">
                  Powered by Replit AI
                  {configUpdates > 0 && <span className="text-primary ml-2">· {configUpdates} change{configUpdates !== 1 ? 's' : ''} made</span>}
                </p>
              </div>
              <button onClick={clearChat} title="Clear chat" className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-card transition-colors">
                <RefreshCw size={14} />
              </button>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-card transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0 custom-scrollbar" style={{ maxHeight: '360px' }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs ${
                    msg.role === 'user' ? 'bg-primary/20 text-primary' :
                    msg.role === 'error' ? 'bg-destructive/20 text-destructive' :
                    'bg-accent/20 text-accent'
                  }`}>
                    {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={`rounded-xl px-3 py-2 text-xs max-w-[82%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary/20 text-foreground rounded-tr-sm'
                      : msg.role === 'error'
                      ? 'bg-destructive/10 text-destructive border border-destructive/20 rounded-tl-sm'
                      : 'bg-card border border-border/50 text-muted-foreground rounded-tl-sm'
                  }`}>
                    {msg.content}
                    {msg.isConfig && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-primary">
                        <Zap size={10} />
                        Hub updated
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center">
                    <Bot size={12} className="text-accent" />
                  </div>
                  <div className="bg-card border border-border/50 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions (only show on first messages) */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex-shrink-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Try asking:</p>
                <div className="flex flex-wrap gap-1.5 max-h-[80px] overflow-hidden">
                  {SUGGESTIONS.slice(0, 6).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s)}
                      className="text-[10px] bg-background border border-border/50 rounded-full px-2.5 py-1 text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border bg-card/50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                  placeholder="Add tracers, change theme, redesign UI..."
                  disabled={loading}
                  className="flex-1 bg-background border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg disabled:opacity-40 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
