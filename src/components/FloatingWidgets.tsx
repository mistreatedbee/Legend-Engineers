import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function FloatingWidgets() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <>
      {/* WhatsApp — refined editorial pill */}
      <a
        href="https://wa.me/27738815050?text=Hello%20Legend%20Engineers,%20I%20would%20like%20assistance%20with%20an%20engineering%20investigation."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 group bg-ink dark:bg-cream text-cream dark:text-ink hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors flex items-center gap-3 px-5 py-3 shadow-2xl"
        aria-label="Chat on WhatsApp">
        
        <MessageCircle size={16} />
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          WhatsApp
        </span>
      </a>

      {/* AI Assistant — editorial chat panel */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isChatOpen &&
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95
            }}
            transition={{
              duration: 0.3
            }}
            className="absolute bottom-20 right-0 w-[360px] bg-cream dark:bg-dark-surface border border-ink/15 dark:border-white/15 shadow-2xl flex flex-col overflow-hidden"
            style={{
              height: '460px'
            }}>
            
              <div className="bg-ink dark:bg-cream text-cream dark:text-ink p-5 flex items-center justify-between border-b border-ink/15">
                <div>
                  <div className="eyebrow opacity-60 mb-1">Assistance</div>
                  <span className="font-display text-2xl italic font-light">
                    Ask Legend
                  </span>
                </div>
                <button
                onClick={() => setIsChatOpen(false)}
                className="hover:opacity-70 transition-opacity"
                aria-label="Close chat">
                
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 p-5 overflow-y-auto bg-cream dark:bg-dark-bg space-y-4">
                <div className="space-y-2">
                  <div className="eyebrow text-ink/40 dark:text-white/40">
                    Assistant — 09:42
                  </div>
                  <p className="font-display text-lg italic font-light text-ink dark:text-cream leading-snug">
                    "Hello. I'm here to help with questions about our
                    engineering services. How may I assist?"
                  </p>
                </div>
              </div>

              <div className="p-4 bg-cream dark:bg-dark-surface border-t border-ink/15 dark:border-white/15">
                <div className="relative">
                  <input
                  type="text"
                  placeholder="Type a question…"
                  className="w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-2 pr-8 font-display text-base font-light text-ink dark:text-cream placeholder-ink/40 dark:placeholder-white/40 transition-colors" />
                
                  <button
                  className="absolute right-0 top-2 text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                  aria-label="Send">
                  
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="group bg-cream dark:bg-dark-surface text-ink dark:text-cream border border-ink/20 dark:border-white/20 hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors flex items-center gap-3 px-5 py-3 shadow-2xl"
          aria-label="Open assistant">
          
          {isChatOpen ?
          <X size={16} /> :

          <>
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse"></span>
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                Ask Legend
              </span>
            </>
          }
        </button>
      </div>
    </>);

}