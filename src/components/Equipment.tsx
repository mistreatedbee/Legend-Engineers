import React from 'react';
import { motion } from 'framer-motion';
const equipment = [
{
  num: '01',
  name: 'Dynamic Cone Penetrometer',
  category: 'Soil Testing',
  image: '/photo1.jpeg',
  specs: 'Measures in-situ strength of fine-grained and granular subgrades.'
},
{
  num: '02',
  name: 'Total Station Theodolite',
  category: 'Surveying',
  image: '/photo3.jpeg',
  specs: 'High-precision optical instrument for modern surveying.'
},
{
  num: '03',
  name: 'Soil Sample Analysis',
  category: 'Laboratory',
  image: '/photo11.jpeg',
  specs: 'Careful collection and documentation of soil samples for laboratory analysis.'
},
{
  num: '04',
  name: 'Dynamic Cone Penetrometer',
  category: 'Field Investigation',
  image: '/photo12.jpeg',
  specs: 'In-situ strength testing of subgrades and granular layers across the site.'
}];

export function Equipment() {
  return (
    <section
      id="equipment"
      className="relative bg-cream-50 dark:bg-dark-surface py-32 md:py-40">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 05 — The Tools
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              The right{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                instruments
              </em>{' '}
              for considered work.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 md:gap-10">
          {equipment.map((item, idx) => {
            const layouts = [
            'col-span-12 md:col-span-5',
            'col-span-12 md:col-span-7 md:mt-24',
            'col-span-12 md:col-span-7',
            'col-span-12 md:col-span-5 md:mt-24'];

            const aspects = [
            'aspect-[3/4]',
            'aspect-[4/3]',
            'aspect-[4/3]',
            'aspect-[3/4]'];

            return (
              <motion.article
                key={item.num}
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
                  duration: 0.7
                }}
                className={layouts[idx]}>
                
                <div
                  className={`relative overflow-hidden ${aspects[idx]} mb-8 shadow-2xl group`}>
                  
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                  
                  <span className="absolute top-6 left-6 font-display text-7xl text-cream font-light leading-none drop-shadow-2xl">
                    {item.num}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="eyebrow text-brand-700 dark:text-brand-400">
                    {item.category}
                  </span>
                </div>
                <h3 className="font-display text-3xl md:text-4xl text-ink dark:text-cream font-light leading-tight mb-3">
                  {item.name}
                </h3>
                <p className="text-ink/60 dark:text-white/60 text-lg font-light leading-relaxed max-w-md">
                  {item.specs}
                </p>
              </motion.article>);

          })}
        </div>
      </div>
    </section>);

}