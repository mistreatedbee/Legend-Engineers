import React from 'react';
import { motion } from 'framer-motion';
const values = [
{
  num: '01',
  title: 'Integrity',
  desc: 'Honest, transparent reporting at every stage.'
},
{
  num: '02',
  title: 'Excellence',
  desc: 'The highest standard of engineering, always.'
},
{
  num: '03',
  title: 'Safety',
  desc: 'A zero-compromise safety policy in the field.'
},
{
  num: '04',
  title: 'Innovation',
  desc: 'Modern testing, time-honoured rigour.'
},
{
  num: '05',
  title: 'Client Care',
  desc: 'Long partnerships built on trust.'
}];

export function About() {
  return (
    <section
      id="about"
      className="relative bg-cream dark:bg-dark-bg py-32 md:py-40 overflow-hidden">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 01 — The Practice
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              A consultancy of{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                careful
              </em>{' '}
              engineers, working the length of South Africa.
            </h2>
          </div>
        </div>

        {/* Asymmetric layered composition */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Left: layered image stack */}
          <div className="col-span-12 lg:col-span-6 relative h-[600px] md:h-[760px]">
            <motion.div
              initial={{
                opacity: 0,
                y: 40
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-100px'
              }}
              transition={{
                duration: 0.8
              }}
              className="absolute top-0 left-0 w-[68%] aspect-[3/4] overflow-hidden shadow-2xl">

              <img
                src="/photo9.jpeg"
                alt="Legend Engineers team on site"
                className="w-full h-full object-cover object-top" />

            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                y: 60
              }}
              whileInView={{
                opacity: 1,
                y: 0
              }}
              viewport={{
                once: true,
                margin: '-100px'
              }}
              transition={{
                duration: 0.8,
                delay: 0.2
              }}
              className="absolute bottom-0 right-0 w-[55%] aspect-[4/5] overflow-hidden shadow-2xl rotate-[2deg]">

              <img
                src="/photo16.jpeg"
                alt="Legend Engineers engineer on site"
                className="w-full h-full object-cover" />

            </motion.div>
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9
              }}
              whileInView={{
                opacity: 1,
                scale: 1
              }}
              viewport={{
                once: true
              }}
              transition={{
                duration: 0.6,
                delay: 0.4
              }}
              className="absolute top-[20%] right-[5%] bg-ink text-cream p-6 md:p-8 max-w-[200px] shadow-2xl -rotate-[3deg]">
              
              <div className="font-display text-6xl md:text-7xl font-light leading-none">
                15
              </div>
              <div className="eyebrow text-cream/60 mt-2 text-[10px]">
                Years in Practice
              </div>
            </motion.div>
          </div>

          {/* Right: editorial text */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true,
              margin: '-100px'
            }}
            transition={{
              duration: 0.8
            }}
            className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-12">
            
            <p className="font-display italic text-2xl md:text-3xl text-ink/80 dark:text-white/80 leading-snug mb-10 font-light text-pretty">
              "Legend Engineers is a trusted consultancy providing geotechnical,
              civil and mechanical services to developers, contractors,
              municipalities, mining operations and private clients."
            </p>

            <div className="space-y-8 pt-8 hairline">
              <div>
                <div className="eyebrow text-brand-700 dark:text-brand-400 mb-3">
                  Our Mission
                </div>
                <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed font-light">
                  Deliver safe, reliable and cost-effective engineering
                  solutions, tailored to the specific needs of each project.
                </p>
              </div>
              <div className="pt-6 hairline">
                <div className="eyebrow text-brand-700 dark:text-brand-400 mb-3">
                  Our Vision
                </div>
                <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed font-light">
                  To stand among South Africa's leading engineering consulting
                  firms — recognised for technical excellence and considered
                  innovation.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Numbered values — editorial list */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mt-32 md:mt-40">
          <div className="col-span-12 md:col-span-3">
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Core Values
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ul>
              {values.map((value, idx) =>
              <motion.li
                key={value.num}
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
                  delay: idx * 0.08
                }}
                className="grid grid-cols-12 gap-6 py-8 hairline group">
                
                  <span className="col-span-2 md:col-span-1 font-display text-2xl md:text-3xl text-ink/40 dark:text-white/40 font-light">
                    {value.num}
                  </span>
                  <span className="col-span-10 md:col-span-4 font-display text-3xl md:text-4xl text-ink dark:text-cream font-light group-hover:italic group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-all">
                    {value.title}
                  </span>
                  <span className="col-span-12 md:col-span-7 text-ink/60 dark:text-white/60 text-lg leading-relaxed font-light md:pt-3">
                    {value.desc}
                  </span>
                </motion.li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);

}