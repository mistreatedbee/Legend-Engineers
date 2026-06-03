import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  time: string;
};

function now() {
  return new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
}

const INITIAL: Message = {
  role: 'assistant',
  content: "Hello. I'm here to help with questions about our engineering services. How may I assist?",
  time: now(),
};

export function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { role: 'user', content: text, time: now() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? data.error ?? 'Sorry, something went wrong.';
      setMessages(m => [...m, { role: 'assistant', content: reply, time: now() }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Unable to connect right now. For immediate assistance, please reach us on WhatsApp at +27 73 881 5050 or email info@legendengineers.co.za.', time: now() }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* WhatsApp — refined editorial pill */}
      <a
        href="https://wa.me/27738815050?text=Hi%20Enerdge%20Group%20%2F%20Legend%20Engineers%2C%20I%20found%20you%20on%20your%20website%20and%20would%20like%20to%20enquire%20about%20an%20engineering%20service."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 group bg-ink dark:bg-cream text-cream dark:text-ink hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors flex items-center gap-3 px-5 py-3 shadow-2xl"
        aria-label="Chat on WhatsApp">
        <MessageCircle size={16} />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">WhatsApp</span>
      </a>

      {/* AI Assistant — editorial chat panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 right-0 w-[360px] bg-cream dark:bg-dark-surface border border-ink/15 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden"
              style={{ height: '460px' }}>

              {/* Header */}
              <div className="bg-ink dark:bg-cream text-cream dark:text-ink p-5 flex items-center justify-between border-b border-ink/15">
                <div>
                  <div className="eyebrow opacity-60 mb-1">Assistance</div>
                  <span className="font-display text-2xl italic font-light">Ask Legend</span>
                </div>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="Close chat">
                  <X size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 p-5 overflow-y-auto bg-cream dark:bg-dark-bg space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`space-y-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className="eyebrow text-ink/40 dark:text-white/40">
                      {msg.role === 'user' ? 'You' : 'Assistant'} — {msg.time}
                    </div>
                    <p className={`font-display text-base italic font-light leading-snug ${
                      msg.role === 'user'
                        ? 'text-brand-700 dark:text-brand-400'
                        : 'text-ink dark:text-cream'
                    }`}>
                      "{msg.content}"
                    </p>
                  </div>
                ))}

                {isLoading && (
                  <div className="space-y-1">
                    <div className="eyebrow text-ink/40 dark:text-white/40">Assistant</div>
                    <div className="flex gap-1 pt-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-white/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-ink/40 dark:bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-cream dark:bg-dark-surface border-t border-ink/15 dark:border-white/15">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a question…"
                    disabled={isLoading}
                    className="w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-2 pr-8 font-display text-base font-light text-ink dark:text-cream placeholder-ink/40 dark:placeholder-white/40 transition-colors disabled:opacity-50" />
                  <button
                    onClick={sendMessage}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-0 top-2 text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors disabled:opacity-30"
                    aria-label="Send">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group bg-cream dark:bg-dark-surface text-ink dark:text-cream border border-ink/20 dark:border-white/20 hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors flex items-center gap-3 px-5 py-3 shadow-2xl"
          aria-label="Open assistant">
          {isChatOpen ? (
            <X size={16} />
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.18em]">Ask Legend</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
