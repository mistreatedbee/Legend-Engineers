import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
const services = [
{
  num: '01',
  id: 'geotechnical',
  title: 'Geotechnical',
  italic: 'Engineering',
  image:
  'https://images.unsplash.com/photo-1578593172074-a7e84128e085?auto=format&fit=crop&w=1200&q=80',
  desc: 'Comprehensive soil and rock investigations for foundation design, site classification, and dolomite assessments.',
  features: [
  'Geotechnical Investigations',
  'Dolomite Studies',
  'NHBRC Enrolments',
  'Foundation Investigations',
  'Site Classification',
  'Stability Assessments']

},
{
  num: '02',
  id: 'civil',
  title: 'Civil',
  italic: 'Engineering',
  image:
  'https://images.unsplash.com/photo-1590496794008-383c8070b257?auto=format&fit=crop&w=1200&q=80',
  desc: 'Infrastructure design and development for commercial, residential, and municipal projects across the country.',
  features: [
  'Road Pavement Design',
  'Stormwater Design',
  'Site Development Plans',
  'Infrastructure Design',
  'Municipal Engineering',
  'Construction Monitoring']

},
{
  num: '03',
  id: 'mechanical',
  title: 'Mechanical',
  italic: 'Engineering',
  image:
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
  desc: 'Industrial mechanical design, equipment assessments and plant engineering for mining and manufacturing.',
  features: [
  'Mechanical Design',
  'Equipment Assessments',
  'Plant Engineering',
  'Industrial Solutions',
  'Maintenance Consulting']

},
{
  num: '04',
  id: 'laboratory',
  title: 'Laboratory',
  italic: 'Testing',
  image:
  'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1200&q=80',
  desc: 'Accurate material testing and analysis in our state-of-the-art laboratory facilities.',
  features: [
  'Rock Testing',
  'Soil Testing',
  'Concrete Testing',
  'Material Analysis',
  'Quality Assurance']

},
{
  num: '05',
  id: 'surveying',
  title: 'Surveying',
  italic: 'Services',
  image:
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  desc: 'Precise topographical and engineering surveys using the latest equipment and methodologies.',
  features: [
  'Borrow Pit Surveys',
  'Centre-Line Surveys',
  'Site Surveys',
  'Engineering Surveys']

},
{
  num: '06',
  id: 'consulting',
  title: 'Reporting',
  italic: '& Consulting',
  image:
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  desc: 'Detailed technical reports, compliance documentation and expert recommendations you can trust.',
  features: [
  'Detailed Technical Reports',
  'Professional Recommendations',
  'Compliance Reports',
  'Feasibility Studies']

}];

export function Services() {
  return (
    <section
      id="services"
      className="relative bg-cream-50 dark:bg-dark-surface py-32 md:py-40">
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 02 — Disciplines
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              Six disciplines,{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                one
              </em>{' '}
              standard of care.
            </h2>
          </div>
        </div>

        {/* Alternating editorial rows */}
        <div className="space-y-32 md:space-y-40">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.article
                key={service.id}
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
                  duration: 0.8
                }}
                className="grid grid-cols-12 gap-6 md:gap-10 items-center">
                
                {/* Image column */}
                <div
                  className={`col-span-12 lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2 lg:col-start-6'}`}>
                  
                  <div className="relative aspect-[4/3] overflow-hidden shadow-2xl group">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    
                    <span className="absolute top-6 left-6 font-display text-7xl md:text-8xl text-cream font-light leading-none drop-shadow-2xl">
                      {service.num}
                    </span>
                  </div>
                </div>

                {/* Text column */}
                <div
                  className={`col-span-12 lg:col-span-4 ${isEven ? 'lg:order-2 lg:col-start-9' : 'lg:order-1 lg:col-start-2'}`}>
                  
                  <span className="eyebrow text-brand-700 dark:text-brand-400 mb-6 block">
                    Discipline {service.num}
                  </span>
                  <h3 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-cream font-light mb-6">
                    {service.title}{' '}
                    <em className="italic font-normal text-brand-700 dark:text-brand-400">
                      {service.italic}
                    </em>
                  </h3>
                  <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed mb-8 font-light text-pretty">
                    {service.desc}
                  </p>

                  <ul className="space-y-3 mb-10">
                    {service.features.map((feat, i) =>
                    <li
                      key={i}
                      className="flex items-baseline gap-4 font-light">
                      
                        <span className="font-mono text-[10px] text-ink/40 dark:text-white/40 uppercase tracking-wider">
                          0{i + 1}
                        </span>
                        <span className="text-ink/80 dark:text-white/80">
                          {feat}
                        </span>
                      </li>
                    )}
                  </ul>

                  <a
                    href="#quote"
                    className="group inline-flex items-center gap-3 text-ink dark:text-cream border-b border-ink/30 dark:border-white/30 hover:border-brand-700 dark:hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors pb-2">
                    
                    <span className="font-mono text-xs uppercase tracking-[0.18em]">
                      Request a quote
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover:rotate-45 transition-transform duration-500" />
                    
                  </a>
                </div>
              </motion.article>);

          })}
        </div>
      </div>
    </section>);

}