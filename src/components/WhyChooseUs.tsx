import React from 'react';
import { motion } from 'framer-motion';
const reasons = [
{
  num: '01',
  title: 'Expert Team',
  desc: 'Qualified professionals with deep industry expertise and technical knowledge.'
},
{
  num: '02',
  title: 'Fast Turnaround',
  desc: 'Quick investigations and reporting to keep your project on schedule.'
},
{
  num: '03',
  title: 'Accredited Services',
  desc: 'Fully CIDB and NHBRC compliant for complete peace of mind.'
},
{
  num: '04',
  title: 'Advanced Equipment',
  desc: 'Utilising the latest testing, laboratory and surveying instruments.'
},
{
  num: '05',
  title: 'Nationwide Coverage',
  desc: 'Serving projects throughout South Africa, regardless of location.'
},
{
  num: '06',
  title: 'Professional Reporting',
  desc: 'Comprehensive, considered reports with expert recommendations.'
}];

export function WhyChooseUs() {
  return (
    <section className="relative bg-ink text-cream py-32 md:py-40 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-cream/40 mt-3"></span>
            <span className="eyebrow text-cream/60">Chapter 03 — Why Us</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] font-light text-balance">
              Technical excellence,{' '}
              <em className="italic text-brand-400 font-normal">practical</em>{' '}
              experience.
            </h2>
          </div>
        </div>

        {/* Photo strip */}
        <div className="grid grid-cols-3 gap-4 mb-24 md:mb-32">
          <div className="aspect-[4/3] overflow-hidden">
            <img src="/photo7.jpeg" alt="Legend Engineers team in the field" className="w-full h-full object-cover object-top" />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img src="/photo2.jpeg" alt="Legend Engineers field vehicle on site" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <img src="/photo13.jpeg" alt="Legend Engineers team briefing" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Editorial split list */}
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-3 md:sticky md:top-32 md:self-start">
            <p className="font-display italic text-2xl text-cream/60 font-light leading-snug">
              Six reasons clients choose Legend — and stay.
            </p>
          </div>

          <ul className="col-span-12 md:col-span-9 border-t border-cream/15">
            {reasons.map((reason, idx) =>
            <motion.li
              key={reason.num}
              initial={{
                opacity: 0,
                y: 20
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-50px'
              }}
              transition={{
                duration: 0.5,
                delay: idx * 0.06
              }}
              className="grid grid-cols-12 gap-6 py-10 md:py-12 border-b border-cream/15 group">
              
                <span className="col-span-2 md:col-span-1 font-display text-3xl md:text-4xl text-cream/40 font-light">
                  {reason.num}
                </span>
                <h3 className="col-span-10 md:col-span-4 font-display text-3xl md:text-5xl font-light leading-[0.95] group-hover:italic group-hover:text-brand-400 transition-all">
                  {reason.title}
                </h3>
                <p className="col-span-12 md:col-span-7 text-cream/70 text-lg leading-relaxed font-light md:pt-2 text-pretty">
                  {reason.desc}
                </p>
              </motion.li>
            )}
          </ul>
        </div>
      </div>
    </section>);

}