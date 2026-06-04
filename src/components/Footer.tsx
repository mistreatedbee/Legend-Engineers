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
              className="font-display text-2xl md:text-4xl text-ink dark:text-cream font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all block break-all mb-3">
              enerdgegroup@gmail.com
            </a>
            <a
              href="mailto:egengineers88@gmail.com"
              className="font-display text-2xl md:text-4xl text-ink dark:text-cream font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all block break-all">
              egengineers88@gmail.com
            </a>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Enerdge Group — Head Office
            </div>
            <p className="font-display text-xl md:text-2xl text-ink/80 dark:text-white/80 font-light italic leading-snug">
              Aldrin St. #2, Reyno Manor
              <br />
              Witbank (eMalahleni), 1035
              <br />
              Mpumalanga, South Africa
            </p>
          </div>
          <div className="col-span-12 md:col-span-6">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4">
              Legend Engineers — Office
            </div>
            <p className="font-display text-xl md:text-2xl text-ink/80 dark:text-white/80 font-light italic leading-snug mb-6">
              Unit 51 Village 4, Ridgeview Estate
              <br />
              Mpumalanga, 1035
              <br />
              South Africa
            </p>
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-2">
              Operating Hours
            </div>
            <p className="font-display text-xl md:text-2xl text-ink/80 dark:text-white/80 font-light italic leading-snug">
              Monday — Friday: 07:00 — 17:00
              <br />
              Saturday: 08:00 — 13:00 SAST
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
              ['WhatsApp Us', 'https://wa.me/27738815050']].
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
            <div className="flex flex-wrap gap-4 mb-5">
              <img
                src="/cidb logo.jpeg"
                alt="CIDB Registered"
                className="h-14 w-auto object-contain opacity-80 dark:opacity-60 rounded"
              />
              <img
                src="/NHBRC logo.jpeg"
                alt="NHBRC Registered"
                className="h-14 w-auto object-contain opacity-80 dark:opacity-60 rounded"
              />
            </div>
            <p className="text-ink/60 dark:text-white/60 font-light leading-relaxed text-sm">
              CIDB Grade 3CE & 3ME
              <br />
              NHBRC Registered
              <br />
              ECSA Affiliated
              <br />
              B-BBEE — 100% Black Owned
              <br />
              VAT Registered
            </p>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="eyebrow text-ink/40 dark:text-white/40 mb-6">
              Follow
            </div>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://www.facebook.com/share/1E574fKKiD/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-xl text-ink/80 dark:text-white/80 font-light hover:italic hover:text-brand-700 dark:hover:text-brand-400 transition-all">
                  Facebook
                </a>
              </li>
              {['LinkedIn', 'Instagram'].map((net) =>
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
            © {new Date().getFullYear()} Enerdge Group (PTY) LTD & Legend Engineers (PTY) LTD
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

        {/* Built by NextWave Digital Solutions */}
        <div className="mt-8 pt-6 border-t border-ink/10 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="eyebrow text-ink/30 dark:text-white/30 block mb-1">Website Designed, Developed &amp; Maintained By</span>
            <span className="font-display text-lg font-light text-ink/50 dark:text-white/50 italic">
              NextWave Digital Solutions
            </span>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <a
              href="mailto:nextwavedigitalsolutionsza@gmail.com"
              className="eyebrow text-ink/40 dark:text-white/40 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              nextwavedigitalsolutionsza@gmail.com
            </a>
            <a
              href="tel:0731531188"
              className="eyebrow text-ink/40 dark:text-white/40 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              073 153 1188
            </a>
            <a
              href="https://www.nextwavedigitalsolutions.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="eyebrow text-ink/40 dark:text-white/40 hover:text-brand-700 dark:hover:text-brand-400 transition-colors">
              www.nextwavedigitalsolutions.co.za
            </a>
          </div>
        </div>
      </div>
    </footer>);
}
