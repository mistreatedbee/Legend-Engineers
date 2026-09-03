import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, DollarSign, FileText, Hash } from 'lucide-react';
import { Project } from './Projects';

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="pt-5 first:pt-0 border-t first:border-t-0 border-ink/10 dark:border-white/10">
      <div className="eyebrow text-ink/50 dark:text-white/50 mb-2 flex items-center gap-2">
        {icon && <span className="opacity-60">{icon}</span>}
        {label}
      </div>
      <div className="font-display text-xl font-light text-ink dark:text-cream leading-snug">
        {value}
      </div>
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Best-effort per-project SEO for this client-rendered page: update the
  // document title/description while it's open, restore on close. Search
  // engines that execute JS (and social re-shares of the /projects/<slug>
  // URL) pick this up; crawlers that don't run JS still get the SPA shell —
  // full server-rendered meta tags would need SSR, which this site doesn't have.
  useEffect(() => {
    const prevTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const prevDescription = description?.getAttribute('content') ?? '';

    document.title = `${project.title} — ${project.company}`;
    if (description) {
      description.setAttribute('content', project.description.slice(0, 160));
    }

    return () => {
      document.title = prevTitle;
      if (description) description.setAttribute('content', prevDescription);
    };
  }, [project]);

  const companyShort =
    project.company === 'Legend Engineers (PTY) LTD' ? 'Legend Engineers' : 'Enerdge Group';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-cream dark:bg-dark-bg">

      {/* Sticky back bar */}
      <div className="sticky top-0 z-40 bg-cream/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-ink/10 dark:border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between gap-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors group">
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            Back to Projects
          </button>
          <span className="eyebrow text-ink/40 dark:text-white/40 hidden sm:block">
            {companyShort}
          </span>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-16 pb-32">

        {/* Hero image */}
        <div className="relative overflow-hidden aspect-[16/7] shadow-2xl mb-16 md:mb-24">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
          <span className="absolute top-6 left-6 eyebrow text-cream/90 bg-ink/40 backdrop-blur-md px-3 py-1.5">
            {project.category}
          </span>
          <span className="absolute top-6 right-6 eyebrow text-cream/90 bg-brand-700/80 backdrop-blur-md px-3 py-1.5">
            {companyShort}
          </span>
        </div>

        {/* Title block */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-20 md:mb-28">
          <div className="col-span-12 md:col-span-8">
            <div className="eyebrow text-ink/50 dark:text-white/50 mb-4 flex items-center gap-2">
              <MapPin size={13} className="opacity-60" />
              {project.location}
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance mb-6">
              {project.title}
            </h1>
            <p className="text-ink/60 dark:text-white/60 font-light text-lg leading-relaxed max-w-2xl">
              {project.description}
            </p>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="bg-ink/5 dark:bg-white/5 p-8 space-y-0">
              {project.value && (
                <Stat
                  label="Contract Value"
                  value={project.value}
                  icon={<DollarSign size={13} />}
                />
              )}
              <Stat
                label="Client"
                value={project.client}
              />
              <Stat
                label="Duration"
                value={project.date}
                icon={<Calendar size={13} />}
              />
              {project.poNumber && (
                <Stat
                  label="Purchase Order"
                  value={project.poNumber}
                  icon={<FileText size={13} />}
                />
              )}
              {project.contractNumber && (
                <Stat
                  label="Contract Number"
                  value={project.contractNumber}
                  icon={<Hash size={13} />}
                />
              )}
              {project.siteArea && (
                <Stat label="Site Area" value={project.siteArea} />
              )}
            </div>
          </div>
        </div>

        {/* Scope of work + company info */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 pt-12 md:pt-16 border-t border-ink/10 dark:border-white/10">
          <div className="col-span-12 md:col-span-5">
            <span className="eyebrow text-ink/50 dark:text-white/50 mb-6 block">
              Scope of Work
            </span>
            <ul className="space-y-4">
              {project.scope.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-brand-700 dark:text-brand-400 font-display font-light mt-0.5 flex-shrink-0">
                    —
                  </span>
                  <span className="text-ink/80 dark:text-white/80 font-light leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {project.gpsCoords && (
              <div className="mt-10 pt-8 border-t border-ink/10 dark:border-white/10">
                <span className="eyebrow text-ink/50 dark:text-white/50 mb-3 block">
                  GPS Coordinates
                </span>
                <p className="font-mono text-sm text-ink/70 dark:text-white/70 leading-relaxed">
                  {project.gpsCoords}
                </p>
              </div>
            )}
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <span className="eyebrow text-ink/50 dark:text-white/50 mb-6 block">
              About {companyShort}
            </span>
            {project.company === 'Legend Engineers (PTY) LTD' ? (
              <div className="space-y-4 text-ink/70 dark:text-white/70 font-light leading-relaxed">
                <img
                  src="/logo.jpg"
                  alt="Legend Engineers"
                  className="h-20 md:h-24 w-auto object-contain mb-2 opacity-90"
                />
                <p>
                  Legend Engineers (PTY) LTD was founded in 2021 and is a 100% black-owned small-sized enterprise specialising in mechanical, civil, and geotechnical engineering services.
                </p>
                <p>
                  Chairman Knowledge Edwin Nkuna holds a BSc in Geological Science from the University of KwaZulu-Natal (2010) and brings over 14 years of experience in the construction industry — spanning civil, building, mechanical, structural, and geotechnical engineering.
                </p>
                <p className="font-mono text-xs text-ink/50 dark:text-white/50 pt-2 space-y-1">
                  <span className="block">Reg No: 2021/954876/07</span>
                  <span className="block">Tax No: 9480368209</span>
                  <span className="block">VAT No: 4050316191</span>
                  <span className="block">CSD No: MAAA1140896</span>
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-ink/70 dark:text-white/70 font-light leading-relaxed">
                <img
                  src="/logo.jpg"
                  alt="Enerdge Group"
                  className="h-20 md:h-24 w-auto object-contain mb-2 opacity-90"
                />
                <p>
                  Enerdge Group (PTY) LTD was founded in 2017 and is a 100% black-owned small-sized enterprise specialising in geotechnical engineering services across South Africa.
                </p>
                <p>
                  The company has completed numerous geotechnical engineering projects for notable clients including Seriti Resources, Eskom Holdings SOC Ltd, and private home builders across Mpumalanga, Gauteng, and beyond.
                </p>
                <p className="font-mono text-xs text-ink/50 dark:text-white/50 pt-2 space-y-1">
                  <span className="block">Reg No: 2017/290464/07</span>
                  <span className="block">Tax No: 9743861164</span>
                  <span className="block">VAT No: 4050316191</span>
                  <span className="block">CSD No: MAAA0874864</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-24 md:mt-32 pt-12 border-t border-ink/10 dark:border-white/10 flex flex-col sm:flex-row gap-6 items-start">
          <a
            href="#booking"
            onClick={onBack}
            className="inline-flex items-center gap-3 bg-brand-700 hover:bg-brand-800 text-cream font-mono text-xs uppercase tracking-[0.18em] px-8 py-4 transition-colors">
            Book a Similar Investigation
          </a>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors group py-4">
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform duration-300"
            />
            All Projects
          </button>
        </div>
      </div>
    </motion.div>
  );
}
