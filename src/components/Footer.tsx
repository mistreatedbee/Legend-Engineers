import React from 'react';
export function Footer() {
  return (
    <footer
      id="contact"
      className="relative bg-cream dark:bg-dark-bg text-ink dark:text-cream pt-32 md:pt-40 pb-12 border-t border-ink/10 dark:border-white/10">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Massive wordmark */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Get in Touch
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] font-light text-balance">
              Let's begin a{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                conversation
              </em>
              .
            </h2>
          </div>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-12 gap-y-12 gap-x-6 md:gap-10 pt-12 border-t border-ink/15 dark:border-white/15">
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Telephone & WhatsApp
            </div>
            <a
              href="tel:+27738815050"
              className="font-display text-4xl md:text-6xl text-ink dark:text-cream font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all block">
              
              +27 73 881 5050
            </a>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Correspondence
            </div>
            <a
              href="mailto:enerdgegroup@gmail.com"
              className="font-display text-3xl md:text-5xl text-ink dark:text-cream font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all block break-all">
              
              enerdgegroup@gmail.com
            </a>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Head Office
            </div>
            <p className="font-display text-2xl md:text-3xl text-ink/80 dark:text-white/80 font-light italic leading-snug">
              Johannesburg, South Africa
              <br />
              Serving all nine provinces.
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Hours
            </div>
            <p className="font-display text-2xl md:text-3xl text-ink/80 dark:text-white/80 font-light italic leading-snug">
              Monday — Friday
              <br />
              08:00 — 17:00 SAST
            </p>
          </div>
        </div>

        {/* Link rows */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mt-24 pt-12 border-t border-ink/15 dark:border-white/15">
          <div className="col-span-6 md:col-span-3">
            <div className="eyebrow text-ink/40 dark:text-white/40 mb-6">
              Navigate
            </div>
            <ul className="space-y-3">
              {['About', 'Services', 'Projects', 'Equipment'].map((link) =>
              <li key={link}>
                  <a
                  href={`#${link.toLowerCase()}`}
                  className="font-display text-xl text-ink/80 dark:text-white/80 font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all">
                  
                    {link}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="col-span-6 md:col-span-3">
            <div className="eyebrow text-ink/40 dark:text-white/40 mb-6">
              Engage
            </div>
            <ul className="space-y-3">
              {[
              ['Book Investigation', '#booking'],
              ['Request Quote', '#quote'],
              ['WhatsApp', 'https://wa.me/27738815050']].
              map(([label, href]) =>
              <li key={label}>
                  <a
                  href={href}
                  className="font-display text-xl text-ink/80 dark:text-white/80 font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all">
                  
                    {label}
                  </a>
                </li>
              )}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow text-ink/40 dark:text-white/40 mb-6">
              Accredited
            </div>
            <p className="text-ink/60 dark:text-white/60 font-light leading-relaxed">
              CIDB Registered
              <br />
              NHBRC Accredited
              <br />
              ECSA Affiliated
              <br />
              ISO 9001 : 2015
            </p>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow text-ink/40 dark:text-white/40 mb-6">
              Follow
            </div>
            <ul className="space-y-3">
              {['LinkedIn', 'Facebook', 'Instagram'].map((net) =>
              <li key={net}>
                  <a
                  href="#"
                  className="font-display text-xl text-ink/80 dark:text-white/80 font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all">
                  
                    {net}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Final wordmark */}
        <div className="mt-32 pt-12 border-t border-ink/15 dark:border-white/15">
          <h3 className="font-display text-[20vw] leading-[0.8] tracking-[-0.05em] text-ink dark:text-cream font-light text-center">
            Legend
            <em className="italic text-brand-700 dark:text-brand-400">.</em>
          </h3>
        </div>

        <div className="mt-12 pt-8 border-t border-ink/15 dark:border-white/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="eyebrow text-ink/40 dark:text-white/40">
            © {new Date().getFullYear()} Legend Engineers — A Division of
            Enerdge Group
          </span>
          <div className="flex gap-8">
            <a
              href="#"
              className="eyebrow text-ink/40 dark:text-white/40 hover:text-brand-700 dark:hover:text-brand-400">
              
              Privacy
            </a>
            <a
              href="#"
              className="eyebrow text-ink/40 dark:text-white/40 hover:text-brand-700 dark:hover:text-brand-400">
              
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>);

}