import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projects as legacyProjects, Project } from '../data/legacyProjects';

export type { Project };

type ApiProject = {
  id: string;
  slug?: string;
  title: string;
  category: string;
  company?: string;
  location: string;
  client: string;
  services: string;
  description: string;
  scope: string[];
  completionDate: string;
  projectValue?: string;
  poNumber?: string;
  contractNumber?: string;
  gpsCoords?: string;
  siteArea?: string;
  coverImage: string;
};

function mapApiProject(p: ApiProject, index: number): Project {
  return {
    id: Number.isFinite(Number(p.id)) ? Number(p.id) : index + 10000,
    slug: p.slug,
    title: p.title,
    category: p.category,
    company: p.company || 'Legend Engineers (PTY) LTD',
    location: p.location,
    client: p.client,
    services: p.services,
    description: p.description,
    scope: p.scope || [],
    date: p.completionDate,
    value: p.projectValue,
    poNumber: p.poNumber,
    contractNumber: p.contractNumber,
    gpsCoords: p.gpsCoords,
    siteArea: p.siteArea,
    image: p.coverImage,
  };
}

interface ProjectsProps {
  onSelectProject: (project: Project) => void;
}

export function Projects({ onSelectProject }: ProjectsProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<Project[]>(legacyProjects);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && Array.isArray(data.projects) && data.projects.length) {
          setProjects(data.projects.map(mapApiProject));
        }
      })
      .catch(() => undefined);
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))];

  const filtered =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory);

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
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs uppercase tracking-[0.18em] pb-2 border-b transition-colors ${
                activeCategory === cat
                  ? 'text-brand-700 dark:text-brand-400 border-brand-700 dark:border-brand-400'
                  : 'text-ink/50 dark:text-white/50 border-transparent hover:text-ink dark:hover:text-cream'
              }`}>
              {cat}
              {activeCategory === cat && (
                <span className="ml-2 text-ink/30 dark:text-white/30">
                  — {filtered.length}
                </span>
              )}
            </button>
          ))}
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
                'col-span-12 md:col-span-5 md:mt-32',
              ];

              const aspectMap = [
                'aspect-[4/3]',
                'aspect-[3/4]',
                'aspect-[4/5]',
                'aspect-[4/3]',
                'aspect-[4/3]',
                'aspect-[3/4]',
              ];

              return (
                <motion.article
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className={layouts[idx % layouts.length]}>
                  <div
                    className="group cursor-pointer"
                    onClick={() => onSelectProject(project)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onSelectProject(project)}>
                    <div
                      className={`relative overflow-hidden ${aspectMap[idx % aspectMap.length]} mb-6 shadow-xl`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      />
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
                        className="text-ink/40 dark:text-white/40 group-hover:text-brand-700 dark:group-hover:text-brand-400 group-hover:rotate-45 transition-all duration-500 flex-shrink-0 mt-2"
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
