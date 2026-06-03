import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
const faqs = [
{
  q: 'What is a geotechnical investigation and why do I need one?',
  a: 'A geotechnical investigation analyses subsurface soil and rock conditions at a proposed development site. It is essential for designing safe, cost-effective foundations — preventing costly failures and identifying risk zones before construction begins. Most municipalities and the NHBRC require it before any building approval.'
},
{
  q: 'How long does a geotechnical investigation take?',
  a: 'Typically 1–4 weeks depending on the site size, scope and complexity. A standard single-storey residential investigation can be completed in 1–2 weeks. Larger or more complex sites — such as dolomite studies or deep investigations — may take 3–4 weeks.'
},
{
  q: 'Is a geotechnical report required by law?',
  a: 'Yes. The NHBRC and most South African municipalities require a geotechnical investigation report before issuing building approvals. It is also a prerequisite for NHBRC enrollment, which protects home buyers under the Housing Consumer Protection Act.'
},
{
  q: 'Do you operate outside Mpumalanga?',
  a: 'Yes — we operate nationally. While our headquarters are in Witbank (eMalahleni), Mpumalanga, we have successfully completed projects in Gauteng (Johannesburg, Alberton, Randburg), Limpopo (Tzaneen), Free State (Mangaung) and KwaZulu-Natal.'
},
{
  q: 'What CIDB grade are you registered at?',
  a: 'Both Enerdge Group and Legend Engineers are registered at CIDB Grade 3CE (Civil Engineering) and 3ME (Mechanical Engineering) — formally qualifying us for government, SOE and Eskom-level project procurement.'
},
{
  q: 'Are you NHBRC registered?',
  a: 'Yes. Enerdge Group (PTY) LTD is NHBRC registered, enabling us to submit geotechnical investigation reports for NHBRC enrollment and to support home builders through the full compliance process.'
},
{
  q: 'Are you B-BBEE compliant?',
  a: 'Yes. Both Enerdge Group and Legend Engineers are 100% Black Owned small-sized enterprises, fully compliant for preferential procurement across government departments, SOEs and private sector clients with B-BBEE requirements.'
},
{
  q: 'Do you work on Eskom projects?',
  a: 'Yes — we are a proven approved vendor at multiple Eskom facilities. Our track record includes civil works, mechanical piping, fire suppression systems and supply and delivery projects at Kusile, Matla, Camden and Grootvlei power stations.'
}];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative bg-cream-50 dark:bg-dark-surface py-32 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 07 — Questions
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              Frequently{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                asked
              </em>
              .
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <ul className="col-span-12 md:col-span-9 md:col-start-4 border-t border-ink/15 dark:border-white/15">
            {faqs.map((item, idx) =>
            <li
              key={idx}
              className="border-b border-ink/15 dark:border-white/15">
              
                <button
                onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full py-8 md:py-10 flex items-start gap-6 md:gap-10 text-left group">
                
                  <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink/40 dark:text-white/40 pt-2 md:pt-3 flex-shrink-0">
                    0{idx + 1}
                  </span>
                  <span className="flex-1 font-display text-2xl md:text-4xl text-ink dark:text-cream font-light leading-snug group-hover:italic group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-all">
                    {item.q}
                  </span>
                  <Plus
                  size={24}
                  className={`text-ink/40 dark:text-white/40 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-all duration-500 flex-shrink-0 mt-2 ${open === idx ? 'rotate-45' : ''}`} />
                
                </button>
                <AnimatePresence>
                  {open === idx &&
                <motion.div
                  initial={{
                    height: 0,
                    opacity: 0
                  }}
                  animate={{
                    height: 'auto',
                    opacity: 1
                  }}
                  exit={{
                    height: 0,
                    opacity: 0
                  }}
                  transition={{
                    duration: 0.4
                  }}
                  className="overflow-hidden">
                  
                      <div className="grid grid-cols-12 gap-6 md:gap-10 pb-10">
                        <div className="col-start-2 col-span-11 md:col-start-3 md:col-span-9">
                          <p className="text-lg md:text-xl text-ink/70 dark:text-white/70 font-light leading-relaxed text-pretty">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}