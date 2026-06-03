import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
const testimonials = [
{
  text: 'Legend Engineers provided an exceptionally thorough geotechnical report for our Sandton development. Their turnaround was impressive and their recommendations saved us significant foundation costs.',
  name: 'David van der Merwe',
  company: 'Apex Properties',
  role: 'Development Director'
},
{
  text: 'We have partnered with Legend on multiple civil infrastructure projects. Their team is highly professional, safety-conscious, and delivers technical excellence every time.',
  name: 'Sarah Naidoo',
  company: 'eThekwini Municipality',
  role: 'Senior Engineer'
},
{
  text: 'The mechanical assessment conducted on our plant equipment was detailed and accurate. Their maintenance consulting has improved our operational efficiency by fifteen percent.',
  name: 'Michael Botha',
  company: 'Platinum Resources',
  role: 'Operations Lead'
}];

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];
  const next = () => setIndex((index + 1) % testimonials.length);
  const prev = () =>
  setIndex((index - 1 + testimonials.length) % testimonials.length);
  return (
    <section className="relative bg-cream dark:bg-dark-bg py-32 md:py-40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-24">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 06 — Voices
            </span>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          <div className="col-span-12 md:col-span-1">
            <span className="font-display text-[12rem] md:text-[18rem] leading-[0.7] text-brand-700/20 dark:text-brand-400/20 italic select-none">
              "
            </span>
          </div>

          <div className="col-span-12 md:col-span-10 lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{
                  opacity: 0,
                  y: 30
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -30
                }}
                transition={{
                  duration: 0.6
                }}>
                
                <p className="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-ink dark:text-cream font-light italic mb-12 text-balance">
                  {current.text}
                </p>
                <footer className="flex items-end justify-between flex-wrap gap-6 pt-8 hairline">
                  <div>
                    <div className="eyebrow text-brand-700 dark:text-brand-400 mb-2">
                      Client Testimony — 0{index + 1} / 0{testimonials.length}
                    </div>
                    <div className="font-display text-2xl text-ink dark:text-cream font-light">
                      {current.name}
                    </div>
                    <div className="text-ink/60 dark:text-white/60 text-sm mt-1 font-light">
                      {current.role}, {current.company}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={prev}
                      className="w-14 h-14 border border-ink/20 dark:border-white/20 flex items-center justify-center text-ink dark:text-cream hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
                      aria-label="Previous testimonial">
                      
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      onClick={next}
                      className="w-14 h-14 border border-ink/20 dark:border-white/20 flex items-center justify-center text-ink dark:text-cream hover:bg-ink hover:text-cream dark:hover:bg-cream dark:hover:text-ink transition-colors"
                      aria-label="Next testimonial">
                      
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
        </div>

        {/* Accreditations strip */}
        <div className="mt-32 pt-12 hairline">
          <div className="eyebrow text-ink/40 dark:text-white/40 mb-8">
            Accredited & Affiliated
          </div>
          <div className="flex flex-wrap items-baseline gap-x-16 gap-y-6">
            {['CIDB', 'NHBRC', 'ISO 9001 : 2015', 'ECSA'].map((name) =>
            <span
              key={name}
              className="font-display text-3xl md:text-4xl text-ink/40 dark:text-white/40 font-light italic hover:text-ink dark:hover:text-cream transition-colors">
              
                {name}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>);

}