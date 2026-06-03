import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
const faqs = [
{
  q: 'What is a geotechnical investigation?',
  a: 'A geotechnical investigation tests soil and rock properties on a site to determine its suitability for construction. It is essential for designing safe and cost-effective foundations.'
},
{
  q: 'How long does testing take?',
  a: 'Timeline depends on scope. Standard soil testing and reporting typically takes one to two weeks; complex dolomite studies or deep drilling can take several weeks.'
},
{
  q: 'What areas do you service?',
  a: 'We service all nine South African provinces — from remote mining sites and rural developments to major metropolitan centres.'
},
{
  q: 'Do you provide NHBRC reports?',
  a: 'Yes — we are fully accredited to provide NHBRC enrolment reports, site classifications, and foundation designs required for residential developments.'
},
{
  q: 'Can you assist with large commercial developments?',
  a: 'Absolutely. We have extensive experience on large-scale commercial, industrial and municipal infrastructure projects — from feasibility through construction monitoring.'
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