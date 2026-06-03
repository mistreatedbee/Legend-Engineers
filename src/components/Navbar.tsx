import React, { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    if (document.documentElement.classList.contains('dark')) setIsDarkMode(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  const navLinks = [
  {
    name: 'About',
    href: '#about'
  },
  {
    name: 'Services',
    href: '#services'
  },
  {
    name: 'Projects',
    href: '#projects'
  },
  {
    name: 'Equipment',
    href: '#equipment'
  },
  {
    name: 'Contact',
    href: '#contact'
  }];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-cream/90 dark:bg-dark-bg/90 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="flex items-center">
          <div className="rounded overflow-hidden shadow-sm">
            <img
              src="/eglogo.jpeg"
              alt="Enerdge Group"
              className="h-10 md:h-12 w-auto object-contain block" />
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) =>
            <li key={link.name}>
                <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.18em] text-ink/70 dark:text-white/70 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
                
                  {link.name}
                </a>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-6 border-l border-ink/15 dark:border-white/15 pl-8">
            <button
              onClick={toggleDarkMode}
              className="text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
              aria-label="Toggle dark mode">
              
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="#booking"
              className="font-mono text-xs uppercase tracking-[0.18em] bg-ink dark:bg-cream text-cream dark:text-ink px-5 py-3 hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors">
              
              Book Investigation
            </a>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button
            onClick={toggleDarkMode}
            className="text-ink/70 dark:text-white/70 p-2">
            
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-ink dark:text-cream p-2"
            aria-label="Toggle menu">
            
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-cream dark:bg-dark-surface border-t border-ink/10 dark:border-white/10 overflow-hidden">
          
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((link, idx) =>
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-display text-3xl text-ink dark:text-cream py-3 border-b border-ink/10 dark:border-white/10 flex items-baseline gap-3">
              
                  <span className="eyebrow text-ink/40 dark:text-white/40 text-[10px]">
                    0{idx + 1}
                  </span>
                  {link.name}
                </a>
            )}
              <a
              href="#booking"
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-mono text-xs uppercase tracking-[0.18em] bg-ink dark:bg-cream text-cream dark:text-ink text-center py-4 mt-4">
              
                Book Investigation
              </a>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}