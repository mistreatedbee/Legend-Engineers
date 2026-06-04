import React from 'react';
import { motion } from 'framer-motion';

const values = [
{
  num: '01',
  title: 'Accountability',
  desc: 'High service standards with full responsibility for every outcome — and a commitment to continuous improvement.'
},
{
  num: '02',
  title: 'Value Add',
  desc: 'Services and products that deliver the utmost value to every client, every time.'
},
{
  num: '03',
  title: 'Convenience',
  desc: 'Multiple disciplines under one banner — making it easy for clients to find the right engineering solution.'
},
{
  num: '04',
  title: 'Credibility',
  desc: 'A work ethic and drive that leaves every client satisfied and willing to refer others.'
},
{
  num: '05',
  title: 'Beyond Boundaries',
  desc: 'Good is not enough. We push for engineering excellence on every project, regardless of scope.'
}];

const timeline = [
{ year: '2006', event: 'Knowledge Nkuna matriculates' },
{ year: '2010', event: 'Graduates BSc Geological Science, University of KwaZulu-Natal' },
{ year: '2017', event: 'Enerdge Group (PTY) LTD registered; first geotechnical projects secured' },
{ year: '2020', event: 'Warona Consulting Engineers road project (Limpopo); DMS Geometics (Free State)' },
{ year: '2021', event: 'Legend Engineers (PTY) LTD incorporated as engineering division' },
{ year: '2022', event: 'Sasol Depot Geotechnical Assessment, Alberton (Gauteng)' },
{ year: '2024', event: 'Multiple Eskom projects at Kusile & Matla worth R3M+; Lumka Developments filling stations' },
{ year: '2025', event: 'Expansion to residential geotech; Seriti project; Gauteng residential investigations' },
{ year: '2026', event: 'Ongoing growth: Grootvlei PS and Emalahleni residential market' },
];

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
              Two companies,{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                one mission
              </em>{' '}
              — engineered for South Africa.
            </h2>
          </div>
        </div>

        {/* Asymmetric layered composition */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Left: image + badge grid */}
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4 md:gap-6 items-start">
            {/* Left column: tall portrait */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="aspect-[3/4] overflow-hidden shadow-2xl">
              <img
                src="/photo9.jpeg"
                alt="Legend Engineers team on site"
                className="w-full h-full object-cover object-top" />
            </motion.div>

            {/* Right column: badge on top, second photo below */}
            <div className="flex flex-col gap-4 md:gap-6 pt-10 md:pt-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="bg-ink text-cream p-5 md:p-8 shadow-2xl -rotate-[3deg] self-end w-full">
                <div className="font-display text-5xl md:text-7xl font-light leading-none">
                  14+
                </div>
                <div className="eyebrow text-cream/60 mt-2 text-[10px]">
                  Years Leadership
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="aspect-[3/4] overflow-hidden shadow-2xl rotate-[2deg]">
                <img
                  src="/photo16.jpeg"
                  alt="Legend Engineers engineer on site"
                  className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Right: editorial text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-12">
            <p className="font-display italic text-2xl md:text-3xl text-ink/80 dark:text-white/80 leading-snug mb-10 font-light text-pretty">
              "Enerdge Group and its engineering division, Legend Engineers, are 100% black-owned South African
              engineering companies headquartered in Mpumalanga — delivering geotechnical, civil, mechanical,
              electrical and building solutions to Eskom, government departments and private developers."
            </p>

            <div className="space-y-8 pt-8 hairline">
              <div>
                <div className="eyebrow text-brand-700 dark:text-brand-400 mb-3">
                  Our Mission
                </div>
                <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed font-light">
                  To maintain quality service through continuous professional development — bringing needed
                  engineering services to communities and enterprises, while promoting equity-efficient
                  practices that conform to SMME legislation.
                </p>
              </div>
              <div className="pt-6 hairline">
                <div className="eyebrow text-brand-700 dark:text-brand-400 mb-3">
                  Our Vision
                </div>
                <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed font-light">
                  To become the most respected engineering service provider in South Africa — exceptional
                  in service delivery and recognised for technical excellence.
                </p>
              </div>
              <div className="pt-6 hairline flex gap-10 flex-wrap">
                <div>
                  <div className="font-display text-4xl md:text-5xl font-light text-ink dark:text-cream">30+</div>
                  <div className="eyebrow text-ink/60 dark:text-white/60 mt-1">Projects completed</div>
                </div>
                <div>
                  <div className="font-display text-4xl md:text-5xl font-light text-ink dark:text-cream">R20M+</div>
                  <div className="eyebrow text-ink/60 dark:text-white/60 mt-1">Value delivered</div>
                </div>
                <div>
                  <div className="font-display text-4xl md:text-5xl font-light text-ink dark:text-cream">8</div>
                  <div className="eyebrow text-ink/60 dark:text-white/60 mt-1">Provinces</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Leadership block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="mt-32 md:mt-40 pt-12 hairline grid grid-cols-12 gap-6 md:gap-10 items-center">
          <div className="col-span-12 md:col-span-3">
            <span className="eyebrow text-ink/60 dark:text-white/60">Leadership</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <div className="flex items-start gap-8 md:gap-12">
              <div className="w-20 h-20 md:w-24 md:h-24 overflow-hidden flex-shrink-0 shadow-lg">
                <img src="/K Nkuna.jpeg" alt="Knowledge Edwin Nkuna" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-ink dark:text-cream font-light leading-tight mb-2">
                  Knowledge Edwin Nkuna
                </h3>
                <div className="eyebrow text-brand-700 dark:text-brand-400 mb-4">
                  Chairman & Director — Enerdge Group & Legend Engineers
                </div>
                <p className="text-ink/70 dark:text-white/70 text-lg font-light leading-relaxed max-w-2xl">
                  BSc Geological Science, University of KwaZulu-Natal (2010). Over 14 years of experience
                  spanning Civil, Building, Mechanical, Structural and Geotechnical Engineering.
                  Track record of successful projects with Eskom Holdings, Seriti Resources, Sasol
                  and multiple government departments across South Africa.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
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

        {/* Company Timeline */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mt-32 md:mt-40">
          <div className="col-span-12 md:col-span-3">
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Our Journey
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <ul className="border-t border-ink/10 dark:border-white/10">
              {timeline.map((item, idx) =>
              <motion.li
                key={item.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className="grid grid-cols-12 gap-6 py-6 border-b border-ink/10 dark:border-white/10 group">
                  <span className="col-span-3 md:col-span-2 font-mono text-sm text-brand-700 dark:text-brand-400 pt-0.5">
                    {item.year}
                  </span>
                  <span className="col-span-9 md:col-span-10 text-ink/80 dark:text-white/80 font-light leading-relaxed group-hover:text-ink dark:group-hover:text-cream transition-colors">
                    {item.event}
                  </span>
                </motion.li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>);
}
