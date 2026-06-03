import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const categories = ['All', 'Geotechnical', 'Civil', 'Mechanical', 'Electrical', 'Building'];

const projects = [
{
  id: 1,
  title: 'Coal Stock Wash Bay — Civil Works',
  category: 'Civil',
  location: 'Kusile Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Civil Works & Construction',
  value: 'R 925,718',
  image: '/photo8.jpeg'
},
{
  id: 2,
  title: 'Fire Pipe Replacement — 9B Conveyor',
  category: 'Mechanical',
  location: 'Matla Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Mechanical Engineering & Piping',
  value: 'R 708,714',
  image: '/photo4.jpeg'
},
{
  id: 3,
  title: 'Excavations, Concrete & Pipeworks',
  category: 'Civil',
  location: 'Kusile Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Civil Works & Pipelines',
  value: 'R 855,000',
  image: '/photo18.jpeg'
},
{
  id: 4,
  title: 'Basement & Underground Parking Investigation',
  category: 'Geotechnical',
  location: 'Reyno Ridge, Mpumalanga',
  client: 'Yakhilizwe Trading',
  services: 'Geotechnical Investigation (1372 m²)',
  value: null,
  image: '/photo3.jpeg'
},
{
  id: 5,
  title: 'Filling Stations Investigation — Naas & Tonga',
  category: 'Geotechnical',
  location: 'Mpumalanga',
  client: 'Lumka Developments',
  services: 'Geotechnical Investigations',
  value: 'R 105,500',
  image: '/photo2.jpeg'
},
{
  id: 6,
  title: 'Multi-Structure Geotechnical Investigation',
  category: 'Geotechnical',
  location: 'Klarinet, Mpumalanga',
  client: 'Seriti Resources',
  services: 'Geotechnical Investigation (1200 m²)',
  value: null,
  image: '/photo12.jpeg'
},
{
  id: 7,
  title: 'Industrial Electrical Installation',
  category: 'Electrical',
  location: 'Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Industrial Electrical Works',
  value: null,
  image: '/electrical1.jpeg'
},
{
  id: 8,
  title: 'Electrical Distribution & Panel Works',
  category: 'Electrical',
  location: 'Mpumalanga',
  client: 'Industrial Client',
  services: 'Electrical Engineering',
  value: null,
  image: '/electrical2.jpeg'
},
{
  id: 9,
  title: 'Plumbing & Water Systems Installation',
  category: 'Building',
  location: 'Emalahleni, Mpumalanga',
  client: 'Private Developer',
  services: 'Plumbing Works',
  value: null,
  image: '/plumbing1.jpeg'
},
{
  id: 10,
  title: 'Suction & Discharge Pipe Works',
  category: 'Building',
  location: 'Mpumalanga',
  client: 'Industrial Client',
  services: 'Building & Plumbing',
  value: null,
  image: '/plumbing2.jpeg'
},
{
  id: 11,
  title: 'Road Construction & Site Civil Works',
  category: 'Civil',
  location: 'Limpopo',
  client: 'Government Department',
  services: 'Civil Works & Road Construction',
  value: null,
  image: '/photo5.jpeg'
},
{
  id: 12,
  title: 'Residential Geotechnical Investigation',
  category: 'Geotechnical',
  location: 'Gauteng',
  client: 'Private Developer',
  services: 'Geotechnical Investigation',
  value: null,
  image: '/photo7.jpeg'
},
{
  id: 13,
  title: 'Power Station Field Operations',
  category: 'Civil',
  location: 'Kusile Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Civil Works & Site Operations',
  value: null,
  image: '/photo10.jpeg'
},
{
  id: 14,
  title: 'Industrial Piping & Mechanical Works',
  category: 'Mechanical',
  location: 'Kusile Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Mechanical Engineering & Piping',
  value: null,
  image: '/photo14.jpeg'
},
{
  id: 15,
  title: 'Concrete Structural Works',
  category: 'Civil',
  location: 'Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Civil Works & Concrete',
  value: null,
  image: '/photo15.jpeg'
},
{
  id: 16,
  title: 'Specialised Welding & Pressure Testing',
  category: 'Mechanical',
  location: 'Matla Power Station, Mpumalanga',
  client: 'Eskom Holdings',
  services: 'Welding & Pressure Testing',
  value: null,
  image: '/photo17.jpeg'
},
{
  id: 17,
  title: 'Bulk Earthworks & Site Preparation',
  category: 'Civil',
  location: 'Emalahleni, Mpumalanga',
  client: 'Private Developer',
  services: 'Bulk Earthworks & Grading',
  value: null,
  image: '/photo19.jpeg'
},
{
  id: 18,
  title: 'Engineering Services — Field Deployment',
  category: 'Civil',
  location: 'South Africa',
  client: 'Various Clients',
  services: 'Multi-Discipline Engineering',
  value: null,
  image: '/servicephoto.jpeg'
}];

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered =
  activeCategory === 'All' ?
  projects :
  projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="projects"
      className="relative bg-cream dark:bg-dark-bg py-32 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 04 — The Work
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              Selected{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                projects
              </em>{' '}
              from across the country.
            </h2>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-16 md:mb-20 pb-8 hairline">
          {categories.map((cat) =>
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-mono text-xs uppercase tracking-[0.18em] pb-2 border-b transition-colors ${activeCategory === cat ? 'text-brand-700 dark:text-brand-400 border-brand-700 dark:border-brand-400' : 'text-ink/50 dark:text-white/50 border-transparent hover:text-ink dark:hover:text-cream'}`}>
              {cat}
              {activeCategory === cat &&
            <span className="ml-2 text-ink/30 dark:text-white/30">
                  — {filtered.length}
                </span>
            }
            </button>
          )}
        </div>

        {/* Asymmetric gallery grid */}
        <motion.div layout className="grid grid-cols-12 gap-6 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, idx) => {
              const layouts = [
              'col-span-12 md:col-span-7',
              'col-span-12 md:col-span-5 md:mt-32',
              'col-span-12 md:col-span-5',
              'col-span-12 md:col-span-7 md:mt-20',
              'col-span-12 md:col-span-7',
              'col-span-12 md:col-span-5 md:mt-32'];

              const aspectMap = [
              'aspect-[4/3]',
              'aspect-[3/4]',
              'aspect-[4/5]',
              'aspect-[4/3]',
              'aspect-[4/3]',
              'aspect-[3/4]'];

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className={layouts[idx % layouts.length]}>
                  <div className="group cursor-pointer">
                    <div className={`relative overflow-hidden ${aspectMap[idx % aspectMap.length]} mb-6 shadow-xl`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <span className="absolute top-5 left-5 eyebrow text-cream/90 bg-ink/40 backdrop-blur-md px-3 py-1.5">
                        {project.category}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-6">
                      <div className="flex-1">
                        <div className="eyebrow text-ink/50 dark:text-white/50 mb-2">
                          {project.location}
                        </div>
                        <h3 className="font-display text-2xl md:text-3xl text-ink dark:text-cream font-light leading-tight group-hover:italic group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-all">
                          {project.title}
                        </h3>
                        <p className="text-ink/60 dark:text-white/60 text-sm mt-2 font-light">
                          {project.client} — {project.services}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={24}
                        className="text-ink/40 dark:text-white/40 group-hover:text-brand-700 dark:group-hover:text-brand-400 group-hover:rotate-45 transition-all duration-500 flex-shrink-0 mt-2" />
                    </div>
                  </div>
                </motion.article>);
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>);
}
